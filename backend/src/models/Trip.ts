import mongoose, { Schema, type InferSchemaType } from "mongoose";

const dayPlanSchema = new Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    theme: { type: String, required: true },
    activities: [{ type: String, required: true }],
    foodSuggestion: { type: String, required: true },
    localTip: { type: String, required: true }
  },
  { _id: false }
);

const budgetSchema = new Schema(
  {
    flights: { type: Number, required: true },
    accommodation: { type: Number, required: true },
    food: { type: Number, required: true },
    activities: { type: Number, required: true },
    localTransport: { type: Number, required: true },
    contingency: { type: Number, required: true },
    total: { type: Number, required: true },
    currency: { type: String, required: true, default: "USD" }
  },
  { _id: false }
);

const hotelSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    reason: { type: String, required: true },
    estimatedNightlyRate: { type: Number, required: true },
    ratingHint: { type: String, required: true }
  },
  { _id: false }
);

const creativeInsightsSchema = new Schema(
  {
    tripFitScore: { type: Number, required: true, min: 0, max: 100 },
    budgetRealityCheck: { type: String, required: true },
    packingTips: [{ type: String, required: true }],
    responsibleTravelTip: { type: String, required: true },
    tradeOffs: [{ type: String, required: true }]
  },
  { _id: false }
);

const tripSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    destination: { type: String, required: true, trim: true },
    numberOfDays: { type: Number, required: true, min: 1, max: 21 },
    budgetType: { type: String, required: true, enum: ["Low", "Medium", "High"] },
    interests: [{ type: String, required: true }],
    status: { type: String, enum: ["draft", "generated"], default: "generated" },
    summary: { type: String, required: true },
    itinerary: { type: [dayPlanSchema], default: [] },
    budget: { type: budgetSchema, required: true },
    hotels: { type: [hotelSchema], default: [] },
    creativeInsights: { type: creativeInsightsSchema, required: true }
  },
  { timestamps: true }
);

export type TripDocument = InferSchemaType<typeof tripSchema> & { _id: mongoose.Types.ObjectId };

export const Trip = mongoose.model<TripDocument>("Trip", tripSchema);
