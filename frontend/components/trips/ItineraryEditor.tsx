"use client";

import { FormEvent, useState } from "react";
import { apiRequest } from "../../lib/api";
import type { Trip } from "../../lib/types";
import { ErrorMessage } from "../common/ErrorMessage";

export function ItineraryEditor({ initialTrip }: { initialTrip: Trip }) {
  const [trip, setTrip] = useState(initialTrip);
  const [error, setError] = useState<string | null>(null);
  const [busyDay, setBusyDay] = useState<number | null>(null);
  const [newActivities, setNewActivities] = useState<Record<number, string>>({});
  const [instructions, setInstructions] = useState<Record<number, string>>({});

  async function addActivity(day: number) {
    const activity = newActivities[day]?.trim();
    if (!activity) return;
    setError(null);
    setBusyDay(day);
    try {
      const response = await apiRequest<{ trip: Trip }>(`/trips/${trip._id}/activities`, {
        method: "PATCH",
        body: JSON.stringify({ day, activity })
      });
      setTrip(response.trip);
      setNewActivities((prev) => ({ ...prev, [day]: "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add activity");
    } finally {
      setBusyDay(null);
    }
  }

  async function removeActivity(day: number, activityIndex: number) {
    setError(null);
    setBusyDay(day);
    try {
      const response = await apiRequest<{ trip: Trip }>(`/trips/${trip._id}/activities`, {
        method: "DELETE",
        body: JSON.stringify({ day, activityIndex })
      });
      setTrip(response.trip);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove activity");
    } finally {
      setBusyDay(null);
    }
  }

  async function regenerateDay(event: FormEvent<HTMLFormElement>, day: number) {
    event.preventDefault();
    const instruction = instructions[day]?.trim() || `Regenerate Day ${day} with better pacing`;
    setError(null);
    setBusyDay(day);
    try {
      const response = await apiRequest<{ trip: Trip }>(`/trips/${trip._id}/regenerate-day`, {
        method: "POST",
        body: JSON.stringify({ day, instruction })
      });
      setTrip(response.trip);
      setInstructions((prev) => ({ ...prev, [day]: "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not regenerate day");
    } finally {
      setBusyDay(null);
    }
  }

  return (
    <section className="space-y-5">
      <ErrorMessage message={error} />
      {trip.itinerary.map((day) => (
        <article key={day.day} className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">Day {day.day} · {day.theme}</p>
              <h2 className="mt-1 text-2xl font-bold">{day.title}</h2>
            </div>
            {busyDay === day.day && <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">Updating...</span>}
          </div>

          <ul className="mt-5 space-y-3">
            {day.activities.map((activity, index) => (
              <li key={`${activity}-${index}`} className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                <span className="text-sm leading-6 text-slate-700">{activity}</span>
                <button
                  onClick={() => removeActivity(day.day, index)}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold hover:bg-white"
                  aria-label={`Remove activity ${index + 1} from day ${day.day}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4">
              <h3 className="font-semibold">Food suggestion</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{day.foodSuggestion}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <h3 className="font-semibold">Local tip</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{day.localTip}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="flex gap-2">
              <input
                value={newActivities[day.day] || ""}
                onChange={(event) => setNewActivities((prev) => ({ ...prev, [day.day]: event.target.value }))}
                placeholder="Add a new activity"
                className="min-w-0 flex-1 rounded-2xl border-slate-300"
              />
              <button onClick={() => addActivity(day.day)} className="rounded-2xl bg-slate-950 px-4 py-2 font-semibold text-white">Add</button>
            </div>
            <form onSubmit={(event) => regenerateDay(event, day.day)} className="flex gap-2">
              <input
                value={instructions[day.day] || ""}
                onChange={(event) => setInstructions((prev) => ({ ...prev, [day.day]: event.target.value }))}
                placeholder={`Regenerate Day ${day.day} with more outdoor activities`}
                className="min-w-0 flex-1 rounded-2xl border-slate-300"
              />
              <button className="rounded-2xl border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-50">Regenerate</button>
            </form>
          </div>
        </article>
      ))}
    </section>
  );
}
