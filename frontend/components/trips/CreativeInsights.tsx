import type { Trip } from "../../lib/types";

export function CreativeInsights({ trip }: { trip: Trip }) {
  const insights = trip.creativeInsights;

  return (
    <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Creative feature</p>
          <h2 className="mt-2 text-xl font-bold">Trip Reality Check</h2>
        </div>
        <div className="rounded-full bg-white px-4 py-2 font-bold text-slate-950">{insights.tripFitScore}%</div>
      </div>
      <p className="mt-5 leading-7 text-slate-200">{insights.budgetRealityCheck}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="font-semibold">Packing tips</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {insights.packingTips.map((tip) => <li key={tip}>• {tip}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Trade-offs</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {insights.tradeOffs.map((tip) => <li key={tip}>• {tip}</li>)}
          </ul>
        </div>
      </div>
      <p className="mt-5 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-slate-200">{insights.responsibleTravelTip}</p>
    </section>
  );
}
