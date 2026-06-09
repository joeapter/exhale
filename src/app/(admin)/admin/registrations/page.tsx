import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import RegistrationsPrintClient, {
  type PrintableRegistration,
} from "./RegistrationsPrintClient";

export default async function AdminRegistrationsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
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
          amount: true,
          paidAt: true,
          createdAt: true,
          notes: true,
        },
      },
    },
  });

  const total = registrations.length;
  const reserved = registrations.filter((r) => r.status === "CONFIRMED").length;
  const pending = registrations.filter((r) => r.status === "PENDING").length;
  const staff = registrations.filter((r) => r.isStaff).length;

  // Per-retreat financial totals — exclude staff and canceled/refunded
  const retreatFinancials = new Map<
    string,
    { title: string; totalPaid: number; totalDue: number }
  >();
  for (const r of registrations) {
    if (r.isStaff) continue;
    if (r.status === "CANCELED" || r.status === "REFUNDED") continue;
    const existing = retreatFinancials.get(r.retreatId) ?? {
      title: r.retreat.title,
      totalPaid: 0,
      totalDue: 0,
    };
    existing.totalPaid += r.amountPaid;
    existing.totalDue += r.amountDue;
    retreatFinancials.set(r.retreatId, existing);
  }

  const printableRegistrations: PrintableRegistration[] = registrations.map(
    (registration) => ({
      id: registration.id,
      status: registration.status,
      isStaff: registration.isStaff,
      firstName: registration.firstName,
      lastName: registration.lastName,
      email: registration.email,
      phone: registration.phone,
      dateOfBirth: registration.dateOfBirth?.toISOString() ?? null,
      dietaryNeeds: registration.dietaryNeeds,
      healthNotes: registration.healthNotes,
      roomingPref: registration.roomingPref,
      additionalNotes: registration.additionalNotes,
      emergencyName: registration.emergencyName,
      emergencyPhone: registration.emergencyPhone,
      emergencyRel: registration.emergencyRel,
      paymentType: registration.paymentType,
      amountDue: registration.amountDue,
      amountPaid: registration.amountPaid,
      confirmedAt: registration.confirmedAt?.toISOString() ?? null,
      confirmationRef: registration.confirmationRef,
      createdAt: registration.createdAt.toISOString(),
      retreat: {
        title: registration.retreat.title,
        location: registration.retreat.location,
        startDate: registration.retreat.startDate.toISOString(),
        endDate: registration.retreat.endDate.toISOString(),
      },
      package: registration.package
        ? {
            name: registration.package.name,
            fullPrice: registration.package.fullPrice,
            depositAmount: registration.package.depositAmount,
          }
        : null,
      payments: registration.payments.map((payment) => ({
        id: payment.id,
        status: payment.status,
        method: payment.method,
        amount: payment.amount,
        paidAt: payment.paidAt?.toISOString() ?? null,
        createdAt: payment.createdAt.toISOString(),
        notes: payment.notes,
      })),
    })
  );

  return (
    <div className="registrations-admin-page max-w-[1400px] mx-auto px-6 py-10">
      <div className="registration-screen-root">
        <div className="flex items-center justify-between mb-8">
          <h1
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "2.25rem",
              color: "var(--color-espresso)",
            }}
          >
            Registrations
          </h1>
          <Link
            href="/api/admin/registrations/export"
            className="inline-flex items-center gap-2 px-5 py-2.5 transition-all uppercase"
            style={{
              fontFamily: "Jost",
              fontWeight: 400,
              fontSize: "0.75rem",
              letterSpacing: "0.16em",
              border: "1px solid rgba(184,144,128,0.5)",
              color: "var(--color-espresso)",
            }}
          >
            Export CSV
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: total },
            { label: "Reserved", value: reserved },
            { label: "Pending", value: pending },
            { label: "Staff", value: staff },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4"
              style={{
                background: "#FAF7F2",
                border: "1px solid rgba(228,216,201,0.8)",
              }}
            >
              <div className="label-sm text-[#9B8F84] mb-1">{stat.label}</div>
              <div
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontWeight: 300,
                  fontSize: "1.75rem",
                  color: "var(--color-espresso)",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {retreatFinancials.size > 0 && (
          <div className="mb-6">
            <div className="label-sm text-[#9B8F84] mb-2">
              Retreat Financials (excluding staff &amp; canceled)
            </div>
            <div className="space-y-2">
              {Array.from(retreatFinancials.values()).map((f) => {
                const balance = Math.max(f.totalDue - f.totalPaid, 0);
                return (
                  <div
                    key={f.title}
                    className="flex flex-wrap items-center gap-4 p-4"
                    style={{
                      background: "#FAF7F2",
                      border: "1px solid rgba(228,216,201,0.8)",
                    }}
                  >
                    <div
                      className="flex-1 min-w-0"
                      style={{
                        fontFamily: "Jost",
                        fontWeight: 400,
                        fontSize: "0.875rem",
                        color: "var(--color-espresso)",
                      }}
                    >
                      {f.title}
                    </div>
                    <div className="flex items-center gap-6">
                      <div>
                        <div className="label-sm text-[#9B8F84] mb-0.5">Collected</div>
                        <div
                          style={{
                            fontFamily: "Cormorant Garamond, Georgia, serif",
                            fontWeight: 300,
                            fontSize: "1.375rem",
                            color: "rgba(90,122,90,1)",
                            lineHeight: 1,
                          }}
                        >
                          {formatCurrency(f.totalPaid)}
                        </div>
                      </div>
                      <div>
                        <div className="label-sm text-[#9B8F84] mb-0.5">Balance Due</div>
                        <div
                          style={{
                            fontFamily: "Cormorant Garamond, Georgia, serif",
                            fontWeight: 300,
                            fontSize: "1.375rem",
                            color:
                              balance > 0
                                ? "rgba(212,149,106,1)"
                                : "var(--color-taupe-light)",
                            lineHeight: 1,
                          }}
                        >
                          {formatCurrency(balance)}
                        </div>
                      </div>
                      <div>
                        <div className="label-sm text-[#9B8F84] mb-0.5">Total Expected</div>
                        <div
                          style={{
                            fontFamily: "Cormorant Garamond, Georgia, serif",
                            fontWeight: 300,
                            fontSize: "1.375rem",
                            color: "var(--color-espresso)",
                            lineHeight: 1,
                          }}
                        >
                          {formatCurrency(f.totalDue)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <RegistrationsPrintClient
        generatedOn={formatDate(new Date())}
        registrations={printableRegistrations}
      />
    </div>
  );
}
