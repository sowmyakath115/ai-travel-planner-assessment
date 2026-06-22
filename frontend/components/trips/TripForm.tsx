"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiRequest } from "../../lib/api";
import type { BudgetType, Trip } from "../../lib/types";
import { ErrorMessage } from "../common/ErrorMessage";

const INTERESTS = ["Food", "Culture", "Adventure", "Shopping", "Nature", "History", "Nightlife", "Art"];

export function TripForm() {
  const router = useRouter();
  const [destination, setDestination] = useState("Tokyo");
  const [numberOfDays, setNumberOfDays] = useState(3);
  const [budgetType, setBudgetType] = useState<BudgetType>("Medium");
  const [interests, setInterests] = useState<string[]>(["Food", "Culture"]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function toggleInterest(interest: string) {
    setInterests((current) =>
      current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await apiRequest<{ trip: Trip }>("/trips", {
        method: "POST",
        body: JSON.stringify({ destination, numberOfDays, budgetType, interests })
      });
      router.push(`/trips/${response.trip._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate trip");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-soft">
      <ErrorMessage message={error} />
      <div className="mt-4 grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium md:col-span-2">
          Destination
          <input value={destination} onChange={(event) => setDestination(event.target.value)} required className="mt-2 w-full rounded-2xl border-slate-300" />
        </label>
        <label className="block text-sm font-medium">
          Number of days
          <input type="number" min={1} max={21} value={numberOfDays} onChange={(event) => setNumberOfDays(Number(event.target.value))} required className="mt-2 w-full rounded-2xl border-slate-300" />
        </label>
        <label className="block text-sm font-medium">
          Budget type
          <select value={budgetType} onChange={(event) => setBudgetType(event.target.value as BudgetType)} className="mt-2 w-full rounded-2xl border-slate-300">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
      </div>
      <fieldset className="mt-6">
        <legend className="text-sm font-semibold">Interests</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${interests.includes(interest) ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              {interest}
            </button>
          ))}
        </div>
      </fieldset>
      <button disabled={submitting || interests.length === 0} className="mt-8 w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white disabled:opacity-60">
        {submitting ? "Generating itinerary..." : "Generate itinerary"}
      </button>
      <p className="mt-3 text-center text-xs text-slate-500">AI generation may take a few seconds. A deterministic fallback is used when no API key is configured.</p>
    </form>
  );
}
