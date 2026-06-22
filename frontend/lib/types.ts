export type BudgetType = "Low" | "Medium" | "High";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface DayPlan {
  day: number;
  title: string;
  theme: string;
  activities: string[];
  foodSuggestion: string;
  localTip: string;
}

export interface BudgetBreakdown {
  flights: number;
  accommodation: number;
  food: number;
  activities: number;
  localTransport: number;
  contingency: number;
  total: number;
  currency: string;
}

export interface HotelSuggestion {
  name: string;
  category: string;
  reason: string;
  estimatedNightlyRate: number;
  ratingHint: string;
}

export interface Trip {
  _id: string;
  destination: string;
  numberOfDays: number;
  budgetType: BudgetType;
  interests: string[];
  summary: string;
  itinerary: DayPlan[];
  budget: BudgetBreakdown;
  hotels: HotelSuggestion[];
  creativeInsights: {
    tripFitScore: number;
    budgetRealityCheck: string;
    packingTips: string[];
    responsibleTravelTip: string;
    tradeOffs: string[];
  };
  createdAt: string;
  updatedAt: string;
}
