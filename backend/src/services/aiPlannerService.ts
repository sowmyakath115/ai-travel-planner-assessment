import OpenAI from "openai";
import { z } from "zod";
import { env } from "../config/env.js";
import type { BudgetType, DayPlan, TravelPlannerOutput } from "../types/trip.js";

export interface GenerateTripInput {
  destination: string;
  numberOfDays: number;
  budgetType: BudgetType;
  interests: string[];
}

export interface RegenerateDayInput extends GenerateTripInput {
  existingItinerary: DayPlan[];
  dayNumber: number;
  instruction: string;
}

const plannerOutputSchema = z.object({
  summary: z.string().min(10),
  itinerary: z.array(
    z.object({
      day: z.number().int().positive(),
      title: z.string(),
      theme: z.string(),
      activities: z.array(z.string()).min(2),
      foodSuggestion: z.string(),
      localTip: z.string()
    })
  ),
  budget: z.object({
    flights: z.number().nonnegative(),
    accommodation: z.number().nonnegative(),
    food: z.number().nonnegative(),
    activities: z.number().nonnegative(),
    localTransport: z.number().nonnegative(),
    contingency: z.number().nonnegative(),
    total: z.number().nonnegative(),
    currency: z.string().default("USD")
  }),
  hotels: z.array(
    z.object({
      name: z.string(),
      category: z.string(),
      reason: z.string(),
      estimatedNightlyRate: z.number().nonnegative(),
      ratingHint: z.string()
    })
  ),
  creativeInsights: z.object({
    tripFitScore: z.number().min(0).max(100),
    budgetRealityCheck: z.string(),
    packingTips: z.array(z.string()).min(2),
    responsibleTravelTip: z.string(),
    tradeOffs: z.array(z.string()).min(1)
  })
});

const dayPlanSchema = z.object({
  day: z.number().int().positive(),
  title: z.string(),
  theme: z.string(),
  activities: z.array(z.string()).min(2),
  foodSuggestion: z.string(),
  localTip: z.string()
});

function getOpenAIClient() {
  if (!env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: env.OPENAI_API_KEY });
}

function dailyAccommodationRate(budgetType: BudgetType) {
  return budgetType === "Low" ? 55 : budgetType === "Medium" ? 120 : 260;
}

function dailyFoodRate(budgetType: BudgetType) {
  return budgetType === "Low" ? 25 : budgetType === "Medium" ? 55 : 110;
}

function dailyActivityRate(budgetType: BudgetType) {
  return budgetType === "Low" ? 20 : budgetType === "Medium" ? 60 : 140;
}

function flightEstimate(destination: string, budgetType: BudgetType) {
  const expensiveDestination = /tokyo|london|paris|new york|switzerland|zurich|iceland|dubai/i.test(destination);
  const base = expensiveDestination ? 520 : 320;
  const multiplier = budgetType === "Low" ? 0.85 : budgetType === "Medium" ? 1 : 1.35;
  return Math.round(base * multiplier);
}

function fallbackPlan(input: GenerateTripInput): TravelPlannerOutput {
  const interests = input.interests.length ? input.interests : ["Culture", "Food"];
  const itinerary: DayPlan[] = Array.from({ length: input.numberOfDays }, (_, index) => {
    const day = index + 1;
    const primaryInterest = interests[index % interests.length];
    return {
      day,
      title: `Day ${day}: ${primaryInterest} discovery in ${input.destination}`,
      theme: primaryInterest,
      activities: [
        `Start with a highly rated ${primaryInterest.toLowerCase()} experience in ${input.destination}`,
        `Visit a nearby landmark or local neighborhood connected to ${primaryInterest.toLowerCase()}`,
        `Leave a flexible evening slot for food, shopping, or rest based on energy level`
      ],
      foodSuggestion: `Try a local restaurant known for regional dishes in ${input.destination}.`,
      localTip: `Pre-book popular attractions and keep commute time realistic for Day ${day}.`
    };
  });

  const flights = flightEstimate(input.destination, input.budgetType);
  const accommodation = dailyAccommodationRate(input.budgetType) * input.numberOfDays;
  const food = dailyFoodRate(input.budgetType) * input.numberOfDays;
  const activities = dailyActivityRate(input.budgetType) * input.numberOfDays;
  const localTransport = Math.round((input.budgetType === "High" ? 35 : input.budgetType === "Medium" ? 20 : 12) * input.numberOfDays);
  const contingency = Math.round((flights + accommodation + food + activities + localTransport) * 0.1);
  const total = flights + accommodation + food + activities + localTransport + contingency;

  return {
    summary: `${input.numberOfDays}-day ${input.budgetType.toLowerCase()} budget trip to ${input.destination} focused on ${interests.join(", ")}.`,
    itinerary,
    budget: { flights, accommodation, food, activities, localTransport, contingency, total, currency: "USD" },
    hotels: [
      {
        name: `${input.destination} Central Stay`,
        category: input.budgetType === "Low" ? "Budget Friendly" : "Practical Base",
        reason: "Chosen as a convenient central option for first-time visitors.",
        estimatedNightlyRate: dailyAccommodationRate(input.budgetType),
        ratingHint: "Look for 4.0+ traveler rating and recent reviews"
      },
      {
        name: `${input.destination} Garden Hotel`,
        category: "Mid Range",
        reason: "Balanced comfort, commute convenience, and traveler review quality.",
        estimatedNightlyRate: Math.round(dailyAccommodationRate("Medium") * 1.15),
        ratingHint: "Prioritize breakfast, transit access, and cancellation policy"
      },
      {
        name: `${input.destination} Grand Palace`,
        category: "Luxury",
        reason: "Premium stay for comfort-focused travelers who want concierge support.",
        estimatedNightlyRate: dailyAccommodationRate("High"),
        ratingHint: "Check service reviews and distance from key attractions"
      }
    ],
    creativeInsights: {
      tripFitScore: input.numberOfDays >= interests.length ? 86 : 72,
      budgetRealityCheck:
        input.budgetType === "Low"
          ? "This plan keeps costs controlled, but it may require public transport, free attractions, and fewer paid experiences."
          : "The selected budget gives enough flexibility for comfort and a few memorable paid experiences.",
      packingTips: ["Carry comfortable walking shoes", "Keep a small day bag for water, charger, and travel documents"],
      responsibleTravelTip: "Respect local neighborhoods, avoid overtouristed peak hours when possible, and support local businesses.",
      tradeOffs: ["More attractions can increase commute fatigue", "A lower budget may reduce hotel location quality"]
    }
  };
}

function buildGenerationPrompt(input: GenerateTripInput) {
  return `You are a senior travel-planning agent inside a production app. Generate a practical itinerary as strict JSON only.

Trip request:
- Destination: ${input.destination}
- Number of days: ${input.numberOfDays}
- Budget type: ${input.budgetType}
- Interests: ${input.interests.join(", ")}

Requirements:
- Return exactly ${input.numberOfDays} itinerary day objects.
- Keep plans realistic, geographically sensible, and not overloaded.
- Estimate budget in USD with flights, accommodation, food, activities, localTransport, contingency, total, currency.
- Suggest 3 hotels across budget levels, with short reasons and estimated nightly rates.
- Include the creativeInsights object as a responsible engineering feature: tripFitScore, budgetRealityCheck, packingTips, responsibleTravelTip, tradeOffs.
- No markdown. No prose outside JSON.

JSON shape:
{
  "summary": "...",
  "itinerary": [{"day": 1, "title": "...", "theme": "...", "activities": ["..."], "foodSuggestion": "...", "localTip": "..."}],
  "budget": {"flights": 0, "accommodation": 0, "food": 0, "activities": 0, "localTransport": 0, "contingency": 0, "total": 0, "currency": "USD"},
  "hotels": [{"name": "...", "category": "...", "reason": "...", "estimatedNightlyRate": 0, "ratingHint": "..."}],
  "creativeInsights": {"tripFitScore": 0, "budgetRealityCheck": "...", "packingTips": ["..."], "responsibleTravelTip": "...", "tradeOffs": ["..."]}
}`;
}

function parseJsonFromModel(content: string) {
  const trimmed = content.trim();
  const withoutFence = trimmed.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "");
  return JSON.parse(withoutFence);
}

export async function generateTravelPlan(input: GenerateTripInput): Promise<TravelPlannerOutput> {
  const client = getOpenAIClient();

  if (!client) {
    return fallbackPlan(input);
  }

  try {
    const completion = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0.35,
      messages: [
        { role: "system", content: "Return valid JSON only. Do not invent dangerous travel advice. Keep recommendations practical and safe." },
        { role: "user", content: buildGenerationPrompt(input) }
      ]
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return fallbackPlan(input);

    const parsed = plannerOutputSchema.parse(parseJsonFromModel(content));
    const recomputedTotal =
      parsed.budget.flights +
      parsed.budget.accommodation +
      parsed.budget.food +
      parsed.budget.activities +
      parsed.budget.localTransport +
      parsed.budget.contingency;

    return {
      ...parsed,
      budget: { ...parsed.budget, total: recomputedTotal }
    };
  } catch (error) {
    console.error("AI generation failed, using deterministic fallback", error);
    return fallbackPlan(input);
  }
}

export async function regenerateDay(input: RegenerateDayInput): Promise<DayPlan> {
  const client = getOpenAIClient();

  if (!client) {
    const base = fallbackPlan(input).itinerary[input.dayNumber - 1];
    return {
      ...base,
      title: `Day ${input.dayNumber}: Updated plan for ${input.destination}`,
      theme: input.instruction || base.theme,
      activities: [
        `Updated request: ${input.instruction}`,
        ...base.activities.slice(0, 2)
      ]
    };
  }

  try {
    const completion = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0.35,
      messages: [
        { role: "system", content: "Return one valid JSON day object only." },
        {
          role: "user",
          content: `Regenerate day ${input.dayNumber} for ${input.destination}.
Trip context: ${input.numberOfDays} days, ${input.budgetType} budget, interests: ${input.interests.join(", ")}.
Existing itinerary: ${JSON.stringify(input.existingItinerary)}
User instruction: ${input.instruction}
Return JSON shape: {"day": ${input.dayNumber}, "title": "...", "theme": "...", "activities": ["..."], "foodSuggestion": "...", "localTip": "..."}`
        }
      ]
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty model response");

    const parsed = dayPlanSchema.parse(parseJsonFromModel(content));
    return { ...parsed, day: input.dayNumber };
  } catch (error) {
    console.error("AI day regeneration failed, using deterministic fallback", error);
    const base = fallbackPlan(input).itinerary[input.dayNumber - 1];
    return {
      ...base,
      day: input.dayNumber,
      title: `Day ${input.dayNumber}: Updated plan for ${input.destination}`,
      activities: [`Updated request: ${input.instruction}`, ...base.activities.slice(0, 2)]
    };
  }
}
