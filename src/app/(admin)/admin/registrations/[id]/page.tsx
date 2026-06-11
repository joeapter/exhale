import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import MarkDepositPaidButton from "@/components/admin/MarkDepositPaidButton";
import MarkPaidFullButton from "@/components/admin/MarkPaidFullButton";
import MarkStaffButton from "@/components/admin/MarkStaffButton";
import DeleteRegistrationButton from "@/components/admin/DeleteRegistrationButton";
import CollectBalancePanel from "@/components/admin/CollectBalancePanel";

type Props = {
  params: Promise<{ id: string }>;
};

function textValue(value?: string | null) {
  return value?.trim() ? value : "—";
}

export default async function RegistrationDetailPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;

  const registration = await prisma.registration.findUnique({
    where: { id },
    include: {
      retreat: {
        select: {
          title: true,
          startDate: true,
          endDate: true,
          location: true,
        },
      },
      package: {
        select: {
          name: true,
          fullPrice: true,
          depositAmount: true,
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          method: true,
          kind: true,
          amount: true,
          chargedAmount: true,
          chargedCurrency: true,
          exchangeRate: true,
          paidAt: true,
          createdAt: true,
          notes: true,
        },
      },
    },
  });

  if (!registration) {
    notFound();
  }

  const statusLabel: Record<string, string> = {
    CONFIRMED: "RESERVED",
  };
  const outstandingBalance = Math.max(registration.amountDue - registration.amountPaid, 0);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <Link
            href="/admin/registrations"
            className="label-sm text-[#9B8F84] hover:text-[#7A6A5A] transition-colors"
          >
            ← Back to registrations
          </Link>
          <h1
            className="mt-3"
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "2.25rem",
              color: "var(--color-espresso)",
            }}
          >
            {registration.firstName} {registration.lastName}
          </h1>
          <p
            style={{
              fontFamily: "Jost",
              fontWeight: 300,
              fontSize: "0.8125rem",
              color: "var(--color-taupe-light)",
            }}
          >
            Created {formatDate(registration.createdAt)} · Ref{" "}
            {registration.confirmationRef ?? "—"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {registration.isStaff && (
            <span
              className="label-sm px-2 py-0.5"
              style={{
                color: "rgba(100,100,180,1)",
                background: "rgba(100,100,180,0.1)",
              }}
            >
              Staff
            </span>
          )}
          {!registration.isStaff &&
            registration.status !== "CANCELED" &&
            registration.status !== "REFUNDED" && (
              <MarkPaidFullButton
                registrationId={registration.id}
                paidFull={registration.amountPaid >= registration.amountDue}
              />
            )}
          {!registration.isStaff &&
            registration.paymentType === "DEPOSIT" &&
            registration.amountPaid < registration.amountDue &&
            registration.amountPaid < (registration.package?.depositAmount ?? registration.amountDue) &&
            (registration.status === "PENDING" ||
              registration.status === "CONFIRMED") && (
              <MarkDepositPaidButton
                registrationId={registration.id}
                depositPaid={false}
              />
            )}
          <MarkStaffButton
            registrationId={registration.id}
            isStaff={registration.isStaff}
          />
          <DeleteRegistrationButton
            registrationId={registration.id}
            guestName={`${registration.firstName} ${registration.lastName}`}
            redirectTo="/admin/registrations"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <section
          className="p-5"
          style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
        >
          <h2 className="label-sm text-[#9B8F84] mb-3">Guest</h2>
          <div className="space-y-2" style={{ fontFamily: "Jost", fontSize: "0.875rem" }}>
            <p style={{ color: "var(--color-espresso)" }}>
              {registration.firstName} {registration.lastName}
            </p>
            <p style={{ color: "var(--color-taupe)" }}>{registration.email}</p>
            <p style={{ color: "var(--color-taupe)" }}>{textValue(registration.phone)}</p>
            <p style={{ color: "var(--color-taupe)" }}>
              Date of birth:{" "}
              {registration.dateOfBirth ? formatDate(registration.dateOfBirth) : "—"}
            </p>
          </div>
        </section>

        <section
          className="p-5"
          style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
        >
          <h2 className="label-sm text-[#9B8F84] mb-3">Retreat</h2>
          <div className="space-y-2" style={{ fontFamily: "Jost", fontSize: "0.875rem" }}>
            <p style={{ color: "var(--color-espresso)" }}>{registration.retreat.title}</p>
            <p style={{ color: "var(--color-taupe)" }}>
              {registration.retreat.location}
            </p>
            <p style={{ color: "var(--color-taupe)" }}>
              {formatDate(registration.retreat.startDate)} –{" "}
              {formatDate(registration.retreat.endDate)}
            </p>
            <p style={{ color: "var(--color-taupe)" }}>
              Package: {registration.package?.name ?? "—"}
            </p>
          </div>
        </section>

        <section
          className="p-5"
          style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
        >
          <h2 className="label-sm text-[#9B8F84] mb-3">Payment</h2>
          <div className="space-y-2" style={{ fontFamily: "Jost", fontSize: "0.875rem" }}>
            <p style={{ color: "var(--color-taupe)" }}>
              Status:{" "}
              <span style={{ color: "var(--color-espresso)" }}>
                {statusLabel[registration.status] ?? registration.status}
              </span>
            </p>
            <p style={{ color: "var(--color-taupe)" }}>
              Type:{" "}
              <span style={{ color: "var(--color-espresso)" }}>
                {registration.paymentType === "DEPOSIT" ? "Deposit" : "Full"}
              </span>
            </p>
            <p style={{ color: "var(--color-taupe)" }}>
              Paid:{" "}
              <span style={{ color: "var(--color-espresso)" }}>
                {formatCurrency(registration.amountPaid)}
              </span>
            </p>
            <p style={{ color: "var(--color-taupe)" }}>
              Due:{" "}
              <span style={{ color: "var(--color-espresso)" }}>
                {formatCurrency(registration.amountDue)}
              </span>
            </p>
            <p style={{ color: "var(--color-taupe)" }}>
              Balance:{" "}
              <span style={{ color: "var(--color-espresso)" }}>
                {formatCurrency(outstandingBalance)}
              </span>
            </p>
          </div>
        </section>

        <section
          className="p-5"
          style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
        >
          <h2 className="label-sm text-[#9B8F84] mb-3">Preferences</h2>
          <div className="space-y-2" style={{ fontFamily: "Jost", fontSize: "0.875rem" }}>
            <p style={{ color: "var(--color-taupe)" }}>
              Roommate request:{" "}
              <span style={{ color: "var(--color-espresso)" }}>{registration.roomingPref}</span>
            </p>
            <p style={{ color: "var(--color-taupe)" }}>
              Dietary: <span style={{ color: "var(--color-espresso)" }}>{textValue(registration.dietaryNeeds)}</span>
            </p>
            <p style={{ color: "var(--color-taupe)" }}>
              Health: <span style={{ color: "var(--color-espresso)" }}>{textValue(registration.healthNotes)}</span>
            </p>
            <p style={{ color: "var(--color-taupe)" }}>
              Notes: <span style={{ color: "var(--color-espresso)" }}>{textValue(registration.additionalNotes)}</span>
            </p>
          </div>
        </section>
      </div>

      {!registration.isStaff &&
        registration.status !== "CANCELED" &&
        registration.status !== "REFUNDED" && (
          <section
            className="mt-5 p-5"
            style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
          >
            <h2 className="label-sm text-[#9B8F84] mb-3">Collect Balance</h2>
            <CollectBalancePanel
              registrationId={registration.id}
              balance={outstandingBalance}
            />
          </section>
        )}

      <section
        className="mt-5 p-5"
        style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
      >
        <h2 className="label-sm text-[#9B8F84] mb-3">Emergency Contact</h2>
        <div className="grid md:grid-cols-3 gap-3" style={{ fontFamily: "Jost", fontSize: "0.875rem" }}>
          <p style={{ color: "var(--color-taupe)" }}>
            Name: <span style={{ color: "var(--color-espresso)" }}>{textValue(registration.emergencyName)}</span>
          </p>
          <p style={{ color: "var(--color-taupe)" }}>
            Phone: <span style={{ color: "var(--color-espresso)" }}>{textValue(registration.emergencyPhone)}</span>
          </p>
          <p style={{ color: "var(--color-taupe)" }}>
            Relationship:{" "}
            <span style={{ color: "var(--color-espresso)" }}>{textValue(registration.emergencyRel)}</span>
          </p>
        </div>
      </section>

      <section
        className="mt-5 p-5"
        style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
      >
        <h2 className="label-sm text-[#9B8F84] mb-3">Payment Events</h2>
        {registration.payments.length === 0 ? (
          <p
            style={{
              fontFamily: "Jost",
              fontWeight: 300,
              fontSize: "0.875rem",
              color: "var(--color-taupe-light)",
            }}
          >
            No payment records yet.
          </p>
        ) : (
          <div className="space-y-2">
            {registration.payments.map((payment) => (
              <div
                key={payment.id}
                className="p-3"
                style={{ border: "1px solid rgba(228,216,201,0.8)", background: "rgba(255,255,255,0.65)" }}
              >
                <p style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.8125rem", color: "var(--color-espresso)" }}>
                  {payment.status} · {payment.kind} · {payment.method} · {formatCurrency(payment.amount)}
                </p>
                {payment.chargedAmount && payment.chargedCurrency && (
                  <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.75rem", color: "var(--color-taupe)" }}>
                    Charged {formatCurrency(payment.chargedAmount, payment.chargedCurrency)}
                    {payment.exchangeRate ? ` · rate ${payment.exchangeRate.toString()}` : ""}
                  </p>
                )}
                <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.75rem", color: "var(--color-taupe-light)" }}>
                  {payment.paidAt
                    ? `Paid ${formatDate(payment.paidAt)}`
                    : `Recorded ${formatDate(payment.createdAt)}`}
                </p>
                {payment.notes && (
                  <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.75rem", color: "var(--color-taupe)" }}>
                    {payment.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
