import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStripePublishableKey } from "@/lib/stripe";
import { formatCurrency, formatDateRange } from "@/lib/utils";
import PaymentPageClient from "./PaymentPageClient";

export const dynamic = "force-dynamic";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const link = await prisma.paymentLink.findUnique({
    where: { token },
    include: {
      registration: {
        include: {
          retreat: { select: { title: true, startDate: true, endDate: true, location: true } },
          package: { select: { name: true } },
        },
      },
    },
  });
  if (!link) notFound();

  const isExpired = link.status === "OPEN" && link.expiresAt <= new Date();
  const isUnavailable = link.status !== "OPEN" || isExpired;
  const kind =
    link.kind === "DEPOSIT"
      ? "Reservation deposit"
      : link.kind === "FULL"
        ? "Full reservation payment"
        : "Remaining balance";
  const lockedCurrency =
    link.chargedCurrency === "ILS" || link.chargedCurrency === "USD"
      ? link.chargedCurrency
      : null;

  return (
    <main className="min-h-screen px-5 py-10 sm:py-16 grain-overlay">
      <div className="relative z-10 max-w-5xl mx-auto">
        <Link href="/" className="block text-center label-md tracking-[0.35em] mb-10">
          EXHALE
        </Link>
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] border bg-[#FAF7F2]"
          style={{ borderColor: "rgba(184,144,128,0.35)" }}>
          <section className="p-7 sm:p-10 bg-[#F5EFE7]">
            <p className="label-sm text-[#B89080] mb-5">{kind}</p>
            <h1 className="text-4xl sm:text-5xl mb-7">
              {link.registration.retreat.title}
            </h1>
            <div className="space-y-3 text-sm text-[#7A6A5A]">
              <p>{formatDateRange(link.registration.retreat.startDate, link.registration.retreat.endDate)}</p>
              <p>{link.registration.retreat.location}</p>
              <p>{link.registration.package?.name}</p>
              <p>{link.registration.firstName} {link.registration.lastName}</p>
            </div>
            <div className="mt-10 pt-6 border-t" style={{ borderColor: "rgba(184,144,128,0.3)" }}>
              <p className="label-sm text-[#9B8F84] mb-2">ILS amount credited</p>
              <p className="serif text-4xl text-[#3D2E22]">{formatCurrency(link.amount)}</p>
              {link.kind === "BALANCE" && (
                <p className="mt-3 text-xs text-[#9B8F84]">Balance due at the end of the retreat.</p>
              )}
            </div>
          </section>
          <section className="p-7 sm:p-10 bg-[#FDFAF6]">
            {isUnavailable ? (
              <div className="py-12">
                <p className="label-sm text-[#B89080] mb-4">
                  {link.status === "PAID" ? "Payment received" : "Link unavailable"}
                </p>
                <h2 className="text-4xl mb-4">
                  {link.status === "PAID" ? "Thank you." : "This payment link has expired."}
                </h2>
                <p>
                  {link.status === "PAID"
                    ? "This reservation payment is complete."
                    : "Please contact EXHALE for a new payment link."}
                </p>
              </div>
            ) : (
              <PaymentPageClient
                token={token}
                publishableKey={getStripePublishableKey()}
                ilsAmount={link.amount}
                lockedCurrency={lockedCurrency}
              />
            )}
          </section>
        </div>
        <p className="text-center text-xs text-[#9B8F84] mt-8">
          Questions? <a href="mailto:booking@exhale.co.il" className="underline">booking@exhale.co.il</a>
        </p>
      </div>
    </main>
  );
}
