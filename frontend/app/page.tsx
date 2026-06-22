import Link from "next/link";
import { Navbar } from "../components/common/Navbar";
import { Compass, Hotel, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  { icon: Sparkles, title: "LLM itinerary agent", copy: "Structured day-by-day plans with budget and travel trade-offs." },
  { icon: ShieldCheck, title: "User-isolated data", copy: "Every trip belongs to one authenticated user and is protected end-to-end." },
  { icon: Hotel, title: "Hotel suggestions", copy: "Budget-aware accommodation ideas with practical selection reasons." },
  { icon: Compass, title: "Trip Reality Check", copy: "A creative feature that explains budget fit, packing tips, and responsible travel choices." }
];

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Full-stack AI travel planner</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            Plan realistic trips with AI, budget clarity, and secure personal dashboards.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            AtlasMind turns destination, days, interests, and budget into an editable itinerary with estimated costs, hotel recommendations, and practical travel trade-offs.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="rounded-full bg-slate-950 px-6 py-3 text-center font-semibold text-white hover:bg-slate-800">Create account</Link>
            <Link href="/login" className="rounded-full border border-slate-300 px-6 py-3 text-center font-semibold hover:bg-white">Login</Link>
          </div>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Example plan</p>
            <h2 className="mt-3 text-2xl font-semibold">Tokyo · 3 days · Medium</h2>
            <div className="mt-6 space-y-4">
              {["Senso-ji and Asakusa street food", "Skytree, Sumida walk, Akihabara", "Ueno Park, museums, local izakaya"].map((item, index) => (
                <div key={item} className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Day {index + 1}</p>
                  <p className="font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 md:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="rounded-3xl bg-white p-6 shadow-sm">
              <Icon className="mb-4" />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.copy}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
