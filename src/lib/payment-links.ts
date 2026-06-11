import { randomBytes } from "crypto";
import type { PaymentKind, PaymentMethod, Prisma } from "@prisma/client";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getSiteUrl, getStripe, getUsdQuoteForIls } from "@/lib/stripe";
import { revalidateRetreatPages } from "@/lib/retreat-cache";
import { sendPaymentConfirmation, sendPaymentNotification } from "@/lib/email";

const INITIAL_PAYMENT_MINUTES = 60;
const BALANCE_PAYMENT_HOURS = 4;

export type SupportedPaymentCurrency = "ILS" | "USD";

export function createPaymentToken() {
  return randomBytes(24).toString("base64url");
}

export function getOutstandingBalance(amountDue: number, amountPaid: number) {
  return Math.max(amountDue - amountPaid, 0);
}

export async function cancelOpenBalancePaymentLinks(registrationId: string) {
  const oldLinks = await prisma.paymentLink.findMany({
    where: { registrationId, kind: "BALANCE", status: "OPEN" },
    select: { stripeSessionId: true },
  });
  for (const oldLink of oldLinks) {
    if (!oldLink.stripeSessionId) continue;
    try {
      await getStripe().checkout.sessions.expire(oldLink.stripeSessionId);
    } catch {
      // It may already be paid or expired; fulfillment remains idempotent.
    }
  }
  await prisma.paymentLink.updateMany({
    where: { registrationId, kind: "BALANCE", status: "OPEN" },
    data: { status: "CANCELED" },
  });
}

export async function createOneTimePaymentLink({
  registrationId,
  kind,
  amount,
  createdById,
}: {
  registrationId: string;
  kind: PaymentKind;
  amount: number;
  createdById?: string;
}) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Payment amount must be greater than zero.");
  }

  if (kind === "BALANCE") {
    await cancelOpenBalancePaymentLinks(registrationId);
  }

  const duration =
    kind === "BALANCE"
      ? BALANCE_PAYMENT_HOURS * 60 * 60 * 1000
      : INITIAL_PAYMENT_MINUTES * 60 * 1000;

  return prisma.paymentLink.create({
    data: {
      token: createPaymentToken(),
      registrationId,
      createdById,
      kind,
      amount,
      expiresAt: new Date(Date.now() + duration),
    },
  });
}

async function restoreInventoryInTransaction(
  tx: Prisma.TransactionClient,
  registrationId: string
) {
  const registration = await tx.registration.findUnique({
    where: { id: registrationId },
    select: {
      id: true,
      retreatId: true,
      packageId: true,
      inventoryStatus: true,
    },
  });

  if (!registration || registration.inventoryStatus !== "HELD") return;

  await tx.registration.update({
    where: { id: registration.id },
    data: {
      inventoryStatus: "RELEASED",
      holdExpiresAt: null,
      status: "CANCELED",
    },
  });

  const retreat = await tx.retreat.findUnique({
    where: { id: registration.retreatId },
    select: { spotsRemaining: true, capacity: true, status: true },
  });

  if (retreat && retreat.spotsRemaining < retreat.capacity) {
    await tx.retreat.update({
      where: { id: registration.retreatId },
      data: {
        spotsRemaining: { increment: 1 },
        ...(retreat.status === "SOLD_OUT" ? { status: "PUBLISHED" as const } : {}),
      },
    });
  }

  if (registration.packageId) {
    const pkg = await tx.retreatPackage.findUnique({
      where: { id: registration.packageId },
      select: { available: true, capacity: true },
    });
    if (pkg && pkg.available < pkg.capacity) {
      await tx.retreatPackage.update({
        where: { id: registration.packageId },
        data: { available: { increment: 1 } },
      });
    }
  }
}

export async function expirePaymentLink(paymentLinkId: string) {
  const result = await prisma.$transaction(async (tx) => {
    const link = await tx.paymentLink.findUnique({
      where: { id: paymentLinkId },
      select: {
        id: true,
        status: true,
        kind: true,
        registrationId: true,
        registration: { select: { retreat: { select: { slug: true } } } },
      },
    });

    if (!link || link.status !== "OPEN") return link?.registration.retreat.slug;

    await tx.paymentLink.update({
      where: { id: link.id },
      data: { status: "EXPIRED" },
    });

    if (link.kind === "DEPOSIT" || link.kind === "FULL") {
      await restoreInventoryInTransaction(tx, link.registrationId);
    }

    return link.registration.retreat.slug;
  });

  revalidateRetreatPages(result);
}

export async function releaseExpiredInventoryHolds() {
  const expired = await prisma.paymentLink.findMany({
    where: { status: "OPEN", expiresAt: { lte: new Date() } },
    select: { id: true },
    take: 50,
  });

  for (const link of expired) {
    await expirePaymentLink(link.id);
  }
}

export async function createCheckoutSessionForPaymentLink(
  token: string,
  requestedCurrency: SupportedPaymentCurrency
) {
  const link = await prisma.paymentLink.findUnique({
    where: { token },
    include: {
      registration: {
        include: {
          retreat: true,
          package: true,
        },
      },
    },
  });

  if (!link) throw new Error("Payment link not found.");
  if (link.status !== "OPEN") throw new Error("This payment link is no longer open.");
  if (link.expiresAt <= new Date()) {
    await expirePaymentLink(link.id);
    throw new Error("This payment link has expired.");
  }

  const registration = link.registration;
  if (link.kind === "BALANCE") {
    const balance = getOutstandingBalance(registration.amountDue, registration.amountPaid);
    if (balance !== link.amount) {
      await prisma.paymentLink.update({
        where: { id: link.id },
        data: { status: "CANCELED" },
      });
      throw new Error("The balance has changed. Ask an administrator to create a new payment link.");
    }
  } else if (registration.inventoryStatus !== "HELD") {
    throw new Error("This reservation is no longer awaiting payment.");
  }

  const stripe = getStripe();

  if (link.chargedCurrency && link.chargedCurrency !== requestedCurrency) {
    throw new Error(
      `This payment was already prepared in ${link.chargedCurrency}. Ask an administrator for a new link to change currency.`
    );
  }

  if (link.stripeSessionId) {
    const existing = await stripe.checkout.sessions.retrieve(link.stripeSessionId);
    if (existing.status === "open" && existing.client_secret) {
      return existing;
    }
  }

  let customerId = registration.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create(
      {
        email: registration.email,
        name: `${registration.firstName} ${registration.lastName}`,
        phone: registration.phone ?? undefined,
        metadata: { registrationId: registration.id },
      },
      { idempotencyKey: `exhale-registration-customer-${registration.id}` }
    );
    customerId = customer.id;
    await prisma.registration.update({
      where: { id: registration.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const kindLabel =
    link.kind === "DEPOSIT"
      ? "Deposit"
      : link.kind === "FULL"
        ? "Full payment"
        : "Remaining balance";
  const description = `${kindLabel} for ${registration.retreat.title}${
    registration.package ? ` — ${registration.package.name}` : ""
  }`;
  const quote =
    requestedCurrency === "USD"
      ? await getUsdQuoteForIls()
      : {
          stripeFxQuoteId: null,
          rate: 1,
          source: "ILS",
          quotedAt: new Date(),
        };
  const chargedAmount =
    requestedCurrency === "USD" ? Math.round(link.amount * quote.rate) : link.amount;

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      ui_mode: "elements",
      customer: customerId,
      client_reference_id: registration.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: requestedCurrency.toLowerCase(),
            unit_amount: chargedAmount,
            product_data: { name: description },
          },
          quantity: 1,
        },
      ],
      return_url: `${getSiteUrl()}/pay/${link.token}?returned=1`,
      expires_at: Math.floor(link.expiresAt.getTime() / 1000),
      metadata: {
        paymentLinkId: link.id,
        registrationId: registration.id,
        kind: link.kind,
        ilsCredit: String(link.amount),
        chargedCurrency: requestedCurrency,
      },
      payment_intent_data: {
        receipt_email: registration.email,
        metadata: {
          paymentLinkId: link.id,
          registrationId: registration.id,
          kind: link.kind,
          ilsCredit: String(link.amount),
          chargedCurrency: requestedCurrency,
        },
      },
    },
    { idempotencyKey: `exhale-payment-link-session-${link.id}` }
  );

  await prisma.paymentLink.update({
    where: { id: link.id },
    data: {
      stripeSessionId: session.id,
      chargedAmount,
      chargedCurrency: requestedCurrency,
      exchangeRate: quote.rate,
      exchangeRateSource: quote.source,
      exchangeRateQuotedAt: quote.quotedAt,
      stripeFxQuoteId: quote.stripeFxQuoteId,
    },
  });

  return session;
}

export async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") {
    return { fulfilled: false, registrationId: null };
  }

  const paymentLinkId = session.metadata?.paymentLinkId;
  if (!paymentLinkId) throw new Error("Stripe session is missing payment link metadata.");

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;
  const chargedAmount = session.amount_total ?? 0;

  const result = await prisma.$transaction(async (tx) => {
    const link = await tx.paymentLink.findUnique({
      where: { id: paymentLinkId },
      include: {
        registration: {
          include: { retreat: { select: { slug: true } } },
        },
      },
    });

    if (!link) throw new Error("Payment link not found.");
    if (link.status === "PAID") {
      return {
        fulfilled: false,
        registrationId: link.registrationId,
        retreatSlug: link.registration.retreat.slug,
        ilsCredit: link.amount,
      };
    }
    if (link.status !== "OPEN") throw new Error("Payment link is not open.");
    const outstanding = getOutstandingBalance(
      link.registration.amountDue,
      link.registration.amountPaid
    );
    if (link.amount > outstanding) {
      throw new Error("The reservation balance changed before payment completed.");
    }
    if (
      chargedAmount !== link.chargedAmount ||
      session.currency?.toUpperCase() !== link.chargedCurrency
    ) {
      throw new Error("Stripe payment amount or currency does not match.");
    }

    const payment = await tx.payment.create({
      data: {
        registrationId: link.registrationId,
        status: "PAID",
        method: "STRIPE",
        kind: link.kind,
        amount: link.amount,
        currency: link.currency,
        chargedAmount,
        chargedCurrency: session.currency?.toUpperCase() ?? link.chargedCurrency,
        exchangeRate: link.exchangeRate,
        exchangeRateSource: link.exchangeRateSource,
        exchangeRateQuotedAt: link.exchangeRateQuotedAt,
        stripeFxQuoteId: link.stripeFxQuoteId,
        stripeSessionId: session.id,
        stripePaymentId: paymentIntentId,
        paidAt: new Date(),
      },
    });

    const newAmountPaid = link.registration.amountPaid + link.amount;
    await tx.registration.update({
      where: { id: link.registrationId },
      data: {
        status: "CONFIRMED",
        confirmedAt: link.registration.confirmedAt ?? new Date(),
        amountPaid: newAmountPaid,
        stripeSessionId:
          link.kind === "DEPOSIT" || link.kind === "FULL" ? session.id : undefined,
        inventoryStatus:
          link.registration.inventoryStatus === "HELD"
            ? "CONFIRMED"
            : link.registration.inventoryStatus,
        holdExpiresAt: null,
      },
    });

    await tx.paymentLink.update({
      where: { id: link.id },
      data: { status: "PAID", paidAt: new Date(), stripeSessionId: session.id },
    });

    return {
      fulfilled: true,
      registrationId: link.registrationId,
      retreatSlug: link.registration.retreat.slug,
      paymentId: payment.id,
      ilsCredit: link.amount,
    };
  });

  revalidateRetreatPages(result.retreatSlug);
  if (result.fulfilled) {
    const registration = await prisma.registration.findUnique({
      where: { id: result.registrationId },
      include: { retreat: true, package: true },
    });
    if (registration) {
      const balanceIls = getOutstandingBalance(registration.amountDue, registration.amountPaid);
      try {
        await Promise.all([
          sendPaymentConfirmation({
            firstName: registration.firstName,
            email: registration.email,
            retreatTitle: registration.retreat.title,
            packageName: registration.package?.name,
            confirmationRef: registration.confirmationRef,
            chargedAmount,
            chargedCurrency: session.currency?.toUpperCase() ?? "ILS",
            ilsCredit: result.ilsCredit,
            balanceIls,
          }),
          sendPaymentNotification({
            name: `${registration.firstName} ${registration.lastName}`,
            retreatTitle: registration.retreat.title,
            chargedAmount,
            chargedCurrency: session.currency?.toUpperCase() ?? "ILS",
            ilsCredit: result.ilsCredit,
            balanceIls,
            registrationId: registration.id,
          }),
        ]);
      } catch (err) {
        console.error("Payment confirmation email failed:", err);
      }
    }
  }
  return result;
}

export async function recordManualPayment({
  registrationId,
  amount,
  method,
  notes,
}: {
  registrationId: string;
  amount: number;
  method: Exclude<PaymentMethod, "STRIPE">;
  notes?: string;
}) {
  const current = await prisma.registration.findUnique({
    where: { id: registrationId },
    select: { amountDue: true, amountPaid: true },
  });
  if (!current) throw new Error("Registration not found.");
  const currentBalance = getOutstandingBalance(current.amountDue, current.amountPaid);
  if (amount <= 0 || amount > currentBalance) {
    throw new Error("Payment amount must be within the outstanding balance.");
  }

  await cancelOpenBalancePaymentLinks(registrationId);
  return prisma.$transaction(async (tx) => {
    const registration = await tx.registration.findUnique({
      where: { id: registrationId },
      select: {
        id: true,
        amountDue: true,
        amountPaid: true,
        status: true,
        confirmedAt: true,
        inventoryStatus: true,
      },
    });

    if (!registration) throw new Error("Registration not found.");
    const balance = getOutstandingBalance(registration.amountDue, registration.amountPaid);
    if (amount <= 0 || amount > balance) {
      throw new Error("Payment amount must be within the outstanding balance.");
    }

    const newAmountPaid = registration.amountPaid + amount;
    const payment = await tx.payment.create({
      data: {
        registrationId,
        status: "PAID",
        method,
        kind: "BALANCE",
        amount,
        notes,
        paidAt: new Date(),
      },
    });

    await tx.registration.update({
      where: { id: registrationId },
      data: {
        amountPaid: newAmountPaid,
        status: "CONFIRMED",
        confirmedAt: registration.confirmedAt ?? new Date(),
        inventoryStatus:
          registration.inventoryStatus === "HELD"
            ? "CONFIRMED"
            : registration.inventoryStatus,
        holdExpiresAt: null,
      },
    });

    return payment;
  });
}
