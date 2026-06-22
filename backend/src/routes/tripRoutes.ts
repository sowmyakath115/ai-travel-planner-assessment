import { Router } from "express";
import {
  addActivity,
  createTrip,
  deleteTrip,
  getTrip,
  listTrips,
  regenerateTripDay,
  removeActivity
} from "../controllers/tripController.js";
import { requireAuth } from "../middleware/auth.js";

export const tripRouter = Router();

tripRouter.use(requireAuth);
tripRouter.get("/", listTrips);
tripRouter.post("/", createTrip);
tripRouter.get("/:id", getTrip);
tripRouter.delete("/:id", deleteTrip);
tripRouter.patch("/:id/activities", addActivity);
tripRouter.delete("/:id/activities", removeActivity);
tripRouter.post("/:id/regenerate-day", regenerateTripDay);
