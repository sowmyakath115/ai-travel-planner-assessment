import Link from "next/link";
import type { Trip } from "../../lib/types";

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link href={`/trips/${trip._id}`} className="block rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{trip.numberOfDays} days · {trip.budgetType} budget</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{trip.destination}</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{trip.creativeInsights.tripFitScore}% fit</span>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{trip.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {trip.interests.map((interest) => (
          <span key={interest} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{interest}</span>
        ))}
      </div>
    </Link>
  );
}
