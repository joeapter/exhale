"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";

export type ExpenseRow = {
  id: string;
  description: string;
  amount: number;
  category: string | null;
  date: string;
  notes: string | null;
  retreatId: string | null;
  retreatTitle: string | null;
};

export type RetreatOption = { id: string; title: string };

const CATEGORIES = [
  "Venue",
  "Food & Catering",
  "Transport",
  "Accommodation",
  "Marketing",
  "Staff",
  "Equipment & Supplies",
  "Other",
];

const inputStyle: React.CSSProperties = {
  fontFamily: "Jost",
  fontWeight: 300,
  fontSize: "0.875rem",
  color: "var(--color-espresso)",
  border: "1px solid rgba(184,144,128,0.5)",
  padding: "8px 12px",
  background: "white",
  outline: "none",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Jost",
  fontWeight: 400,
  fontSize: "0.6875rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#9B8F84",
  display: "block",
  marginBottom: "4px",
};

type Props = {
  expenses: ExpenseRow[];
  retreats: RetreatOption[];
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function ExpensesClient({ expenses, retreats }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    description: "",
    amountShekel: "",
    category: "",
    date: today(),
    retreatId: "",
    notes: "",
  });

  function resetForm() {
    setForm({ description: "", amountShekel: "", category: "", date: today(), retreatId: "", notes: "" });
    setFormError(null);
  }

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const shekel = parseFloat(form.amountShekel);
    if (!form.description.trim()) { setFormError("Description is required."); return; }
    if (isNaN(shekel) || shekel <= 0) { setFormError("Enter a valid amount."); return; }

    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/admin/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: form.description.trim(),
          amount: Math.round(shekel * 100),
          category: form.category || null,
          date: form.date,
          retreatId: form.retreatId || null,
          notes: form.notes.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save expense.");
      resetForm();
      setShowForm(false);
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save expense.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, description: string) {
    if (!window.confirm(`Delete expense "${description}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete.");
      router.refresh();
    } catch {
      alert("Failed to delete expense.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      {/* Add Expense Form */}
      <div className="mb-6">
        {!showForm ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 transition-all uppercase"
            style={{
              fontFamily: "Jost",
              fontWeight: 400,
              fontSize: "0.75rem",
              letterSpacing: "0.16em",
              border: "1px solid rgba(61,46,34,0.72)",
              color: "#FDFAF6",
              background: "var(--color-espresso)",
              cursor: "pointer",
            }}
          >
            + Add Expense
          </button>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6"
            style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
          >
            <h2
              className="mb-5"
              style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 300, fontSize: "1.375rem", color: "var(--color-espresso)" }}
            >
              New Expense
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label style={labelStyle}>Description *</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="e.g. Venue deposit"
                  style={inputStyle}
                  autoFocus
                />
              </div>

              <div>
                <label style={labelStyle}>Amount (₪) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amountShekel}
                  onChange={(e) => set("amountShekel", e.target.value)}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  style={{ ...inputStyle, appearance: "none" }}
                >
                  <option value="">— None —</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Retreat</label>
                <select
                  value={form.retreatId}
                  onChange={(e) => set("retreatId", e.target.value)}
                  style={{ ...inputStyle, appearance: "none" }}
                >
                  <option value="">General / Business expense</option>
                  {retreats.map((r) => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label style={labelStyle}>Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={2}
                  placeholder="Optional notes"
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
            </div>

            {formError && (
              <p className="mb-3" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-candle)" }}>
                {formError}
              </p>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 uppercase transition-colors"
                style={{
                  fontFamily: "Jost",
                  fontWeight: 400,
                  fontSize: "0.75rem",
                  letterSpacing: "0.16em",
                  border: "1px solid rgba(61,46,34,0.72)",
                  color: "#FDFAF6",
                  background: submitting ? "var(--color-taupe-light)" : "var(--color-espresso)",
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Saving..." : "Save Expense"}
              </button>
              <button
                type="button"
                onClick={() => { resetForm(); setShowForm(false); }}
                disabled={submitting}
                className="px-5 py-2.5 uppercase transition-colors"
                style={{
                  fontFamily: "Jost",
                  fontWeight: 400,
                  fontSize: "0.75rem",
                  letterSpacing: "0.16em",
                  border: "1px solid rgba(184,144,128,0.4)",
                  color: "var(--color-taupe)",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Expense Table */}
      {expenses.length === 0 ? (
        <div
          className="p-10 text-center"
          style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
        >
          <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe-light)" }}>
            No expenses recorded yet.
          </p>
        </div>
      ) : (
        <div style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)", overflowX: "auto" }}>
          <table className="w-full min-w-[700px]">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(228,216,201,0.8)" }}>
                {["Description", "Category", "Retreat", "Amount", "Date", ""].map((col) => (
                  <th key={col} className="text-left px-4 py-3.5 label-sm text-[#9B8F84]">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr
                  key={expense.id}
                  style={{ borderBottom: index < expenses.length - 1 ? "1px solid rgba(228,216,201,0.5)" : "none" }}
                >
                  <td className="px-4 py-3.5">
                    <div style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.875rem", color: "var(--color-espresso)" }}>
                      {expense.description}
                    </div>
                    {expense.notes && (
                      <div style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.75rem", color: "var(--color-taupe-light)", marginTop: "2px" }}>
                        {expense.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {expense.category ? (
                      <span
                        className="label-sm px-2 py-0.5"
                        style={{ color: "var(--color-taupe)", background: "rgba(155,143,132,0.12)" }}
                      >
                        {expense.category}
                      </span>
                    ) : (
                      <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe-light)" }}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: expense.retreatTitle ? "var(--color-taupe)" : "var(--color-taupe-light)" }}>
                      {expense.retreatTitle ?? "General"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.875rem", color: "var(--color-espresso)" }}>
                      {formatCurrency(expense.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe-light)" }}>
                      {formatDate(expense.date)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(expense.id, expense.description)}
                      disabled={deletingId === expense.id}
                      className="label-sm uppercase transition-colors"
                      style={{
                        letterSpacing: "0.1em",
                        color: deletingId === expense.id ? "var(--color-taupe-light)" : "rgba(180,100,100,0.8)",
                        textDecoration: "underline",
                        textUnderlineOffset: "2px",
                        cursor: deletingId === expense.id ? "not-allowed" : "pointer",
                      }}
                    >
                      {deletingId === expense.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
