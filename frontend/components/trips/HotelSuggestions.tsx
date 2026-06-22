import type { HotelSuggestion } from "../../lib/types";

export function HotelSuggestions({ hotels, currency }: { hotels: HotelSuggestion[]; currency: string }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">Recommended hotels</h2>
      <div className="mt-5 space-y-4">
        {hotels.map((hotel) => (
          <article key={hotel.name} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{hotel.name}</h3>
                <p className="text-sm text-slate-500">{hotel.category}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">{currency} {hotel.estimatedNightlyRate}/night</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{hotel.reason}</p>
            <p className="mt-2 text-xs font-medium text-slate-500">{hotel.ratingHint}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
