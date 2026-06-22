import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/authRoutes.js";
import { tripRouter } from "./routes/tripRoutes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 250,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "ai-travel-planner-api" });
});

app.use("/api/auth", authRouter);
app.use("/api/trips", tripRouter);
app.use(notFound);
app.use(errorHandler);

connectDatabase()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`API listening on port ${env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
