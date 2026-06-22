import { ProtectedRoute } from "../../../components/auth/ProtectedRoute";
import { Navbar } from "../../../components/common/Navbar";
import { TripForm } from "../../../components/trips/TripForm";

export default function NewTripPage() {
  return (
    <ProtectedRoute>
      <main>
        <Navbar />
        <section className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">New trip</p>
          <h1 className="mt-2 text-4xl font-bold">Tell the agent what kind of trip you want</h1>
          <p className="mt-3 text-slate-600">The planner will generate a realistic day-by-day itinerary, budget estimate, hotel ideas, and a Trip Reality Check.</p>
          <div className="mt-8"><TripForm /></div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
