"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { Navbar } from "../../components/common/Navbar";
import { TripCard } from "../../components/trips/TripCard";
import { apiRequest } from "../../lib/api";
import type { Trip } from "../../lib/types";

function DashboardContent() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<{ trips: Trip[] }>("/trips")
      .then((response) => setTrips(response.trips))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load trips"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
            <h1 className="mt-2 text-4xl font-bold">Your private trips</h1>
          </div>
          <Link href="/trips/new" className="rounded-full bg-slate-950 px-5 py-3 font-semibold text-white">Plan a new trip</Link>
        </div>
        {loading && <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">Loading trips...</div>}
        {error && <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>}
        {!loading && !error && trips.length === 0 && (
          <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold">No trips yet</h2>
            <p className="mt-2 text-slate-600">Create your first AI-generated itinerary.</p>
            <Link href="/trips/new" className="mt-6 inline-block rounded-full bg-slate-950 px-5 py-3 font-semibold text-white">Get started</Link>
          </div>
        )}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {trips.map((trip) => <TripCard key={trip._id} trip={trip} />)}
        </div>
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return <ProtectedRoute><DashboardContent /></ProtectedRoute>;
}
