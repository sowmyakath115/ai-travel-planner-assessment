import type { BudgetBreakdown } from "../../lib/types";

const labels: Record<keyof Omit<BudgetBreakdown, "currency" | "total">, string> = {
  flights: "Flights",
  accommodation: "Accommodation",
  food: "Food",
  activities: "Activities",
  localTransport: "Local transport",
  contingency: "Contingency"
};

export function BudgetCard({ budget }: { budget: BudgetBreakdown }) {
  const entries = Object.entries(labels) as [keyof typeof labels, string][];

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">Estimated budget</h2>
      <div className="mt-5 space-y-3">
        {entries.map(([key, label]) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="text-slate-600">{label}</span>
            <span className="font-semibold">{budget.currency} {budget[key].toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-between border-t border-slate-200 pt-5 text-lg font-bold">
        <span>Total</span>
        <span>{budget.currency} {budget.total.toLocaleString()}</span>
      </div>
    </section>
  );
}
