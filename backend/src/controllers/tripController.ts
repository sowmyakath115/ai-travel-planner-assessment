import { z } from "zod";
import { Trip } from "../models/Trip.js";
import { generateTravelPlan, regenerateDay } from "../services/aiPlannerService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const tripInputSchema = z.object({
  destination: z.string().trim().min(2).max(120),
  numberOfDays: z.coerce.number().int().min(1).max(21),
  budgetType: z.enum(["Low", "Medium", "High"]),
  interests: z.array(z.string().trim().min(2).max(40)).min(1).max(8)
});

const addActivitySchema = z.object({
  day: z.coerce.number().int().min(1),
  activity: z.string().trim().min(3).max(180)
});

const removeActivitySchema = z.object({
  day: z.coerce.number().int().min(1),
  activityIndex: z.coerce.number().int().min(0)
});

const regenerateDaySchema = z.object({
  day: z.coerce.number().int().min(1),
  instruction: z.string().trim().min(5).max(300)
});

function requireUserId(userId: string | undefined) {
  if (!userId) throw new ApiError(401, "Authentication required");
  return userId;
}

async function getOwnedTrip(tripId: string, userId: string) {
  const trip = await Trip.findOne({ _id: tripId, userId });
  if (!trip) throw new ApiError(404, "Trip not found");
  return trip;
}

export const createTrip = asyncHandler(async (req, res) => {
  const userId = requireUserId(req.user?.id);
  const input = tripInputSchema.parse(req.body);
  const plan = await generateTravelPlan(input);

  const trip = await Trip.create({
    userId,
    destination: input.destination,
    numberOfDays: input.numberOfDays,
    budgetType: input.budgetType,
    interests: input.interests,
    status: "generated",
    ...plan
  });

  res.status(201).json({ trip });
});

export const listTrips = asyncHandler(async (req, res) => {
  const userId = requireUserId(req.user?.id);
  const trips = await Trip.find({ userId }).sort({ updatedAt: -1 });
  res.json({ trips });
});

export const getTrip = asyncHandler(async (req, res) => {
  const userId = requireUserId(req.user?.id);
  const trip = await getOwnedTrip(req.params.id, userId);
  res.json({ trip });
});

export const deleteTrip = asyncHandler(async (req, res) => {
  const userId = requireUserId(req.user?.id);
  await getOwnedTrip(req.params.id, userId);
  await Trip.deleteOne({ _id: req.params.id, userId });
  res.status(204).send();
});

export const addActivity = asyncHandler(async (req, res) => {
  const userId = requireUserId(req.user?.id);
  const input = addActivitySchema.parse(req.body);
  const trip = await getOwnedTrip(req.params.id, userId);
  const dayPlan = trip.itinerary.find((day) => day.day === input.day);

  if (!dayPlan) throw new ApiError(404, "Day not found in itinerary");

  dayPlan.activities.push(input.activity);
  await trip.save();

  res.json({ trip });
});

export const removeActivity = asyncHandler(async (req, res) => {
  const userId = requireUserId(req.user?.id);
  const input = removeActivitySchema.parse(req.body);
  const trip = await getOwnedTrip(req.params.id, userId);
  const dayPlan = trip.itinerary.find((day) => day.day === input.day);

  if (!dayPlan) throw new ApiError(404, "Day not found in itinerary");
  if (input.activityIndex >= dayPlan.activities.length) throw new ApiError(400, "Activity index is invalid");

  dayPlan.activities.splice(input.activityIndex, 1);
  await trip.save();

  res.json({ trip });
});

export const regenerateTripDay = asyncHandler(async (req, res) => {
  const userId = requireUserId(req.user?.id);
  const input = regenerateDaySchema.parse(req.body);
  const trip = await getOwnedTrip(req.params.id, userId);

  if (input.day > trip.numberOfDays) {
    throw new ApiError(400, "Day number exceeds trip length");
  }

  const updatedDay = await regenerateDay({
    destination: trip.destination,
    numberOfDays: trip.numberOfDays,
    budgetType: trip.budgetType as "Low" | "Medium" | "High",
    interests: trip.interests,
    existingItinerary: trip.itinerary,
    dayNumber: input.day,
    instruction: input.instruction
  });

  trip.itinerary = trip.itinerary.map((dayPlan) => (dayPlan.day === input.day ? updatedDay : dayPlan));
  await trip.save();

  res.json({ trip });
});
