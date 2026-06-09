import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import ExpensesClient, { type ExpenseRow, type RetreatOption } from "./ExpensesClient";

export default async function AdminExpensesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [expenses, retreats] = await Promise.all([
    prisma.expense.findMany({
      orderBy: { date: "desc" },
      include: { retreat: { select: { title: true } } },
    }),
    prisma.retreat.findMany({
      orderBy: { startDate: "desc" },
      select: { id: true, title: true },
    }),
  ]);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const generalExpenses = expenses.filter((e) => !e.retreatId).reduce((sum, e) => sum + e.amount, 0);

  // Per-retreat expense totals
  const byRetreat = new Map<string, { title: string; total: number }>();
  for (const e of expenses) {
    if (!e.retreatId || !e.retreat) continue;
    const existing = byRetreat.get(e.retreatId) ?? { title: e.retreat.title, total: 0 };
    existing.total += e.amount;
    byRetreat.set(e.retreatId, existing);
  }

  const expenseRows: ExpenseRow[] = expenses.map((e) => ({
    id: e.id,
    description: e.description,
    amount: e.amount,
    category: e.category,
    date: e.date.toISOString(),
    notes: e.notes,
    retreatId: e.retreatId,
    retreatTitle: e.retreat?.title ?? null,
  }));

  const retreatOptions: RetreatOption[] = retreats.map((r) => ({
    id: r.id,
    title: r.title,
  }));

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontWeight: 300,
            fontSize: "2.25rem",
            color: "var(--color-espresso)",
          }}
        >
          Expenses
        </h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div
          className="p-4"
          style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
        >
          <div className="label-sm text-[#9B8F84] mb-1">Total Expenses</div>
          <div
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "1.75rem",
              color: "rgba(180,100,100,1)",
              lineHeight: 1,
            }}
          >
            {formatCurrency(totalExpenses)}
          </div>
        </div>

        {Array.from(byRetreat.values()).map((r) => (
          <div
            key={r.title}
            className="p-4"
            style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
          >
            <div className="label-sm text-[#9B8F84] mb-1 truncate" title={r.title}>
              {r.title}
            </div>
            <div
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "1.75rem",
                color: "var(--color-espresso)",
                lineHeight: 1,
              }}
            >
              {formatCurrency(r.total)}
            </div>
          </div>
        ))}

        {generalExpenses > 0 && (
          <div
            className="p-4"
            style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
          >
            <div className="label-sm text-[#9B8F84] mb-1">General / Business</div>
            <div
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "1.75rem",
                color: "var(--color-espresso)",
                lineHeight: 1,
              }}
            >
              {formatCurrency(generalExpenses)}
            </div>
          </div>
        )}
      </div>

      <ExpensesClient expenses={expenseRows} retreats={retreatOptions} />
    </div>
  );
}
