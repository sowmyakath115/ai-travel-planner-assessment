"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "../../../components/auth/ProtectedRoute";
import { Navbar } from "../../../components/common/Navbar";
import { BudgetCard } from "../../../components/trips/BudgetCard";
import { CreativeInsights } from "../../../components/trips/CreativeInsights";
import { HotelSuggestions } from "../../../components/trips/HotelSuggestions";
import { ItineraryEditor } from "../../../components/trips/ItineraryEditor";
import { apiRequest } from "../../../lib/api";
import type { Trip } from "../../../lib/types";

function TripDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<{ trip: Trip }>(`/trips/${params.id}`)
      .then((response) => setTrip(response.trip))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load trip"))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function deleteTrip() {
    if (!trip || !confirm("Delete this trip?")) return;
    await apiRequest(`/trips/${trip._id}`, { method: "DELETE" });
    router.push("/dashboard");
  }

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-slate-950">← Back to dashboard</Link>
        {loading && <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">Loading trip...</div>}
        {error && <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>}
        {trip && (
          <>
            <div className="mt-6 flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{trip.numberOfDays} days · {trip.budgetType} budget</p>
                <h1 className="mt-2 text-4xl font-bold">{trip.destination}</h1>
                <p className="mt-3 max-w-3xl leading-7 text-slate-600">{trip.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {trip.interests.map((interest) => <span key={interest} className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700">{interest}</span>)}
                </div>
              </div>
              <button onClick={deleteTrip} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Delete trip</button>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <ItineraryEditor initialTrip={trip} />
              <aside className="space-y-6">
                <BudgetCard budget={trip.budget} />
                <HotelSuggestions hotels={trip.hotels} currency={trip.budget.currency} />
                <CreativeInsights trip={trip} />
              </aside>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default function TripDetailsPage() {
  return <ProtectedRoute><TripDetailsContent /></ProtectedRoute>;
}
