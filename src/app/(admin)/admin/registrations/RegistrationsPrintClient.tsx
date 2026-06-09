"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { CheckSquare, Printer, Square } from "lucide-react";
import MarkDepositPaidButton from "@/components/admin/MarkDepositPaidButton";
import InlineAmountEdit from "@/components/admin/InlineAmountEdit";
import MarkPaidFullButton from "@/components/admin/MarkPaidFullButton";
import MarkStaffButton from "@/components/admin/MarkStaffButton";
import DeleteRegistrationButton from "@/components/admin/DeleteRegistrationButton";
import { formatCurrency, formatDate, formatDateRange } from "@/lib/utils";

type RegistrationPayment = {
  id: string;
  status: string;
  method: string;
  amount: number;
  paidAt: string | null;
  createdAt: string;
  notes: string | null;
};

export type PrintableRegistration = {
  id: string;
  status: string;
  isStaff: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  dietaryNeeds: string | null;
  healthNotes: string | null;
  roomingPref: string;
  additionalNotes: string | null;
  emergencyName: string | null;
  emergencyPhone: string | null;
  emergencyRel: string | null;
  paymentType: string;
  amountDue: number;
  amountPaid: number;
  confirmedAt: string | null;
  confirmationRef: string | null;
  createdAt: string;
  retreat: {
    title: string;
    location: string;
    startDate: string;
    endDate: string;
  };
  package: {
    name: string;
    fullPrice: number;
    depositAmount: number;
  } | null;
  payments: RegistrationPayment[];
};

type Props = {
  generatedOn: string;
  registrations: PrintableRegistration[];
};

const statusColor: Record<string, { color: string; bg: string }> = {
  PENDING: { color: "rgba(212,149,106,1)", bg: "rgba(212,149,106,0.1)" },
  CONFIRMED: { color: "rgba(90,122,90,1)", bg: "rgba(90,122,90,0.1)" },
  WAITLISTED: { color: "rgba(100,100,180,1)", bg: "rgba(100,100,180,0.1)" },
  CANCELED: { color: "rgba(180,100,100,1)", bg: "rgba(180,100,100,0.1)" },
  REFUNDED: { color: "rgba(155,143,132,1)", bg: "rgba(155,143,132,0.1)" },
};

const statusLabel: Record<string, string> = {
  CONFIRMED: "Reserved",
  PENDING: "Pending",
  WAITLISTED: "Waitlisted",
  CANCELED: "Canceled",
  REFUNDED: "Refunded",
};

const roomingLabel: Record<string, string> = {
  SOLO: "Solo",
  WITH_FRIEND: "With friend",
  NO_PREFERENCE: "No preference",
};

const paymentTypeLabel: Record<string, string> = {
  DEPOSIT: "Deposit",
  FULL: "Full",
};

function textValue(value?: string | null) {
  return value?.trim() ? value : "-";
}

function dateValue(value?: string | null) {
  return value ? formatDate(value) : "-";
}

function fullName(registration: PrintableRegistration) {
  return `${registration.firstName} ${registration.lastName}`;
}

function statusText(status: string) {
  return statusLabel[status] ?? status;
}

function paymentTypeText(type: string) {
  return paymentTypeLabel[type] ?? type;
}

function roomingText(roomingPref: string) {
  return roomingLabel[roomingPref] ?? roomingPref;
}

function paymentEventDate(payment: RegistrationPayment) {
  return payment.paidAt
    ? `Paid ${formatDate(payment.paidAt)}`
    : `Recorded ${formatDate(payment.createdAt)}`;
}

function PdfField({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={
        wide
          ? "registration-pdf-field registration-pdf-field-wide"
          : "registration-pdf-field"
      }
    >
      <span className="registration-pdf-field-label">{label}</span>
      <span className="registration-pdf-field-value">{value}</span>
    </div>
  );
}

export default function RegistrationsPrintClient({
  generatedOn,
  registrations,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(registrations.map((registration) => registration.id))
  );
  const allCheckboxRef = useRef<HTMLInputElement>(null);

  const selectedRegistrations = useMemo(
    () => registrations.filter((registration) => selectedIds.has(registration.id)),
    [registrations, selectedIds]
  );

  const selectedCount = selectedRegistrations.length;
  const allSelected =
    registrations.length > 0 && selectedCount === registrations.length;
  const partiallySelected = selectedCount > 0 && !allSelected;

  useEffect(() => {
    if (allCheckboxRef.current) {
      allCheckboxRef.current.indeterminate = partiallySelected;
    }
  }, [partiallySelected]);

  function selectAll() {
    setSelectedIds(new Set(registrations.map((registration) => registration.id)));
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function toggleAll() {
    if (allSelected) {
      clearSelection();
      return;
    }
    selectAll();
  }

  function toggleRegistration(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function printPdf() {
    if (selectedCount === 0) return;
    window.print();
  }

  return (
    <>
      <div className="registration-screen-root">
        {registrations.length === 0 ? (
          <div
            style={{
              background: "#FAF7F2",
              border: "1px solid rgba(228,216,201,0.8)",
            }}
          >
            <p
              className="px-4 py-10 text-center"
              style={{
                fontFamily: "Jost",
                fontWeight: 300,
                fontSize: "0.875rem",
                color: "var(--color-taupe-light)",
              }}
            >
              No registrations yet.
            </p>
          </div>
        ) : (
          <>
            <div
              className="mb-4 flex flex-wrap items-center justify-between gap-4 p-4"
              style={{
                background: "#FDFAF6",
                border: "1px solid rgba(184,144,128,0.28)",
              }}
            >
              <div>
                <div className="label-sm text-[#9B8F84] mb-1">PDF Selection</div>
                <p
                  style={{
                    fontFamily: "Jost",
                    fontWeight: 300,
                    fontSize: "0.875rem",
                    color: "var(--color-taupe)",
                  }}
                >
                  {selectedCount} of {registrations.length} selected for the
                  registration packet.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="inline-flex h-10 items-center gap-2 px-4 transition-colors"
                  style={{
                    border: "1px solid rgba(184,144,128,0.45)",
                    color: "var(--color-espresso)",
                    background: "transparent",
                    fontFamily: "Jost",
                    fontSize: "0.75rem",
                    fontWeight: 400,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    cursor: "pointer",
                  }}
                >
                  <CheckSquare aria-hidden="true" size={15} strokeWidth={1.8} />
                  Select All
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="inline-flex h-10 items-center gap-2 px-4 transition-colors"
                  style={{
                    border: "1px solid rgba(184,144,128,0.3)",
                    color: "var(--color-taupe)",
                    background: "transparent",
                    fontFamily: "Jost",
                    fontSize: "0.75rem",
                    fontWeight: 400,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    cursor: "pointer",
                  }}
                >
                  <Square aria-hidden="true" size={15} strokeWidth={1.8} />
                  Clear
                </button>
                <button
                  type="button"
                  onClick={printPdf}
                  disabled={selectedCount === 0}
                  className="inline-flex h-10 items-center gap-2 px-5 transition-colors disabled:opacity-50"
                  style={{
                    border: "1px solid rgba(61,46,34,0.72)",
                    color: selectedCount === 0 ? "var(--color-taupe)" : "#FDFAF6",
                    background:
                      selectedCount === 0
                        ? "rgba(155,143,132,0.12)"
                        : "var(--color-espresso)",
                    fontFamily: "Jost",
                    fontSize: "0.75rem",
                    fontWeight: 400,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    cursor: selectedCount === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  <Printer aria-hidden="true" size={15} strokeWidth={1.8} />
                  Print PDF
                </button>
              </div>
            </div>

            <div
              style={{
                background: "#FAF7F2",
                border: "1px solid rgba(228,216,201,0.8)",
                overflowX: "auto",
              }}
            >
              <table className="w-full min-w-[980px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(228,216,201,0.8)" }}>
                    <th className="px-4 py-3.5 text-left">
                      <input
                        ref={allCheckboxRef}
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        aria-label="Select all registrations"
                        className="h-4 w-4 accent-[#7A6A5A]"
                      />
                    </th>
                    {[
                      "Guest",
                      "Retreat",
                      "Package",
                      "Payment",
                      "Amount",
                      "Status",
                      "Date",
                      "Actions",
                    ].map((col) => (
                      <th
                        key={col}
                        className="text-left px-4 py-3.5 label-sm text-[#9B8F84]"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration, index) => {
                    const selected = selectedIds.has(registration.id);
                    const colors = statusColor[registration.status];

                    return (
                      <tr
                        key={registration.id}
                        style={{
                          borderBottom:
                            index < registrations.length - 1
                              ? "1px solid rgba(228,216,201,0.5)"
                              : "none",
                          background: selected
                            ? "rgba(255,255,255,0.58)"
                            : "transparent",
                        }}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleRegistration(registration.id)}
                            aria-label={`Select ${fullName(registration)}`}
                            className="h-4 w-4 accent-[#7A6A5A]"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div
                            style={{
                              fontFamily: "Jost",
                              fontWeight: 400,
                              fontSize: "0.875rem",
                              color: "var(--color-espresso)",
                            }}
                          >
                            {fullName(registration)}
                          </div>
                          <div
                            style={{
                              fontFamily: "Jost",
                              fontWeight: 300,
                              fontSize: "0.75rem",
                              color: "var(--color-taupe-light)",
                            }}
                          >
                            {registration.email}
                          </div>
                        </td>
                        <td
                          className="px-4 py-4"
                          style={{
                            fontFamily: "Jost",
                            fontWeight: 300,
                            fontSize: "0.8125rem",
                            color: "var(--color-taupe)",
                          }}
                        >
                          {registration.retreat.title}
                        </td>
                        <td
                          className="px-4 py-4"
                          style={{
                            fontFamily: "Jost",
                            fontWeight: 300,
                            fontSize: "0.8125rem",
                            color: "var(--color-taupe)",
                          }}
                        >
                          {registration.package?.name ?? "-"}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className="label-sm"
                            style={{
                              color:
                                registration.paymentType === "FULL"
                                  ? "var(--color-taupe)"
                                  : "rgba(212,149,106,0.9)",
                            }}
                          >
                            {paymentTypeText(registration.paymentType)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {registration.isStaff ? (
                            <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe-light)" }}>—</span>
                          ) : (
                            <div className="space-y-0.5">
                              <InlineAmountEdit
                                registrationId={registration.id}
                                amount={registration.amountPaid}
                                endpoint="amount-paid"
                                bodyKey="amountPaid"
                                prefix="paid "
                              />
                              <InlineAmountEdit
                                registrationId={registration.id}
                                amount={registration.amountDue}
                                endpoint="amount-due"
                                bodyKey="amountDue"
                                prefix="total "
                              />
                              {(() => {
                                const balance = registration.amountDue - registration.amountPaid;
                                if (balance <= 0) return null;
                                return (
                                  <div style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.75rem", color: "rgba(212,149,106,1)", marginTop: "4px" }}>
                                    {formatCurrency(balance)} due
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <span
                              className="label-sm px-2 py-0.5 self-start"
                              style={{
                                color: colors?.color ?? "var(--color-taupe)",
                                background: colors?.bg ?? "transparent",
                              }}
                            >
                              {statusText(registration.status)}
                            </span>
                            {registration.isStaff && (
                              <span
                                className="label-sm px-2 py-0.5 self-start"
                                style={{
                                  color: "rgba(100,100,180,1)",
                                  background: "rgba(100,100,180,0.1)",
                                }}
                              >
                                Staff
                              </span>
                            )}
                          </div>
                        </td>
                        <td
                          className="px-4 py-4"
                          style={{
                            fontFamily: "Jost",
                            fontWeight: 300,
                            fontSize: "0.8125rem",
                            color: "var(--color-taupe-light)",
                          }}
                        >
                          {formatDate(registration.createdAt)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap items-center gap-3">
                            {!registration.isStaff &&
                            registration.status !== "CANCELED" &&
                            registration.status !== "REFUNDED" ? (
                              <MarkPaidFullButton
                                registrationId={registration.id}
                                paidFull={registration.amountPaid >= registration.amountDue}
                              />
                            ) : null}
                            {!registration.isStaff &&
                            registration.paymentType === "DEPOSIT" &&
                            registration.amountPaid < registration.amountDue &&
                            registration.amountPaid < (registration.package?.depositAmount ?? registration.amountDue) &&
                            (registration.status === "PENDING" ||
                              registration.status === "CONFIRMED") ? (
                              <MarkDepositPaidButton
                                registrationId={registration.id}
                                depositPaid={false}
                              />
                            ) : null}
                            <MarkStaffButton
                              registrationId={registration.id}
                              isStaff={registration.isStaff}
                            />
                            <Link
                              href={`/admin/registrations/${registration.id}`}
                              className="label-sm text-[#B89080] hover:text-[#7A6A5A] transition-colors"
                            >
                              View
                            </Link>
                            <DeleteRegistrationButton
                              registrationId={registration.id}
                              guestName={fullName(registration)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="registration-print-root" aria-hidden="true">
        {selectedRegistrations.map((registration, index) => {
          const balance = Math.max(
            registration.amountDue - registration.amountPaid,
            0
          );
          const colors = statusColor[registration.status];

          return (
            <article className="registration-pdf-sheet" key={registration.id}>
              <div className="registration-pdf-header">
                <div>
                  <div className="registration-pdf-kicker">
                    Exhale registration record
                  </div>
                  <h1>{fullName(registration)}</h1>
                  <p className="registration-pdf-subtitle">
                    {registration.retreat.title} -{" "}
                    {formatDateRange(
                      registration.retreat.startDate,
                      registration.retreat.endDate
                    )}
                  </p>
                </div>
                <div className="registration-pdf-meta">
                  <span
                    className="registration-pdf-status"
                    style={{
                      color: colors?.color ?? "#7A6A5A",
                      borderColor: colors?.color ?? "#C9BAA8",
                      background: colors?.bg ?? "transparent",
                    }}
                  >
                    {statusText(registration.status)}
                  </span>
                  <span>Record {index + 1} of {selectedCount}</span>
                  <span>Generated {generatedOn}</span>
                </div>
              </div>

              <div className="registration-pdf-summary">
                <div>
                  <span>Confirmation</span>
                  <strong>{registration.confirmationRef ?? "-"}</strong>
                </div>
                <div>
                  <span>Package</span>
                  <strong>{registration.package?.name ?? "-"}</strong>
                </div>
                <div>
                  <span>Balance</span>
                  <strong>{formatCurrency(balance)}</strong>
                </div>
              </div>

              <div className="registration-pdf-grid">
                <section className="registration-pdf-section">
                  <h2>Guest Details</h2>
                  <PdfField label="Email" value={registration.email} />
                  <PdfField label="Phone" value={textValue(registration.phone)} />
                  <PdfField
                    label="Date of birth"
                    value={dateValue(registration.dateOfBirth)}
                  />
                  <PdfField
                    label="Submitted"
                    value={formatDate(registration.createdAt)}
                  />
                </section>

                <section className="registration-pdf-section">
                  <h2>Retreat</h2>
                  <PdfField label="Location" value={registration.retreat.location} />
                  <PdfField
                    label="Dates"
                    value={formatDateRange(
                      registration.retreat.startDate,
                      registration.retreat.endDate
                    )}
                  />
                  <PdfField
                    label="Rooming"
                    value={roomingText(registration.roomingPref)}
                  />
                  <PdfField
                    label="Confirmed"
                    value={dateValue(registration.confirmedAt)}
                  />
                </section>

                <section className="registration-pdf-section">
                  <h2>Payment</h2>
                  <PdfField
                    label="Payment type"
                    value={paymentTypeText(registration.paymentType)}
                  />
                  <PdfField label="Amount paid" value={formatCurrency(registration.amountPaid)} />
                  <PdfField label="Amount due" value={formatCurrency(registration.amountDue)} />
                  <PdfField label="Balance" value={formatCurrency(balance)} />
                </section>

                <section className="registration-pdf-section">
                  <h2>Emergency Contact</h2>
                  <PdfField label="Name" value={textValue(registration.emergencyName)} />
                  <PdfField label="Phone" value={textValue(registration.emergencyPhone)} />
                  <PdfField
                    label="Relationship"
                    value={textValue(registration.emergencyRel)}
                  />
                </section>

                <section className="registration-pdf-section registration-pdf-section-full">
                  <h2>Preferences And Notes</h2>
                  <PdfField
                    label="Dietary"
                    value={textValue(registration.dietaryNeeds)}
                    wide
                  />
                  <PdfField
                    label="Health"
                    value={textValue(registration.healthNotes)}
                    wide
                  />
                  <PdfField
                    label="Notes"
                    value={textValue(registration.additionalNotes)}
                    wide
                  />
                </section>

                {registration.payments.length > 0 ? (
                  <section className="registration-pdf-section registration-pdf-section-full">
                    <h2>Payment Events</h2>
                    <div className="registration-pdf-events">
                      {registration.payments.map((payment) => (
                        <div className="registration-pdf-event" key={payment.id}>
                          <div>
                            <strong>{formatCurrency(payment.amount)}</strong>
                            <span>
                              {payment.status} via {payment.method}
                            </span>
                          </div>
                          <div>
                            <span>{paymentEventDate(payment)}</span>
                            {payment.notes ? <span>{payment.notes}</span> : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
