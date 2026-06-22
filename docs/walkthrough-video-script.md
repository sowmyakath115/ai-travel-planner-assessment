# 3-4 Minute Walkthrough Video Script

## 0:00 - 0:25 — Introduction

Hi, I’m Sowmya. This is AtlasMind, a full-stack AI travel planner built for the engineering assessment. The app lets users register, log in, generate a day-by-day travel itinerary using an LLM agent, estimate budget, edit the itinerary, regenerate individual days, and view hotel suggestions.

I built it as a TypeScript monorepo with a Next.js frontend, Express backend, and MongoDB database.

## 0:25 - 1:00 — Authentication and authorization

First, I’ll show the authentication flow. A new user can register with name, email, and password. Passwords are hashed on the backend using bcrypt, and the API returns a JWT after successful registration or login.

The dashboard is a protected route, so unauthenticated users are redirected to login. On the backend, every trip route uses authentication middleware. More importantly, every trip query is scoped by both trip ID and user ID. That means even if one user somehow knows another trip ID, they still cannot read, edit, or delete it.

## 1:00 - 1:45 — AI itinerary generation

Now I’ll create a trip. The form collects destination, number of days, budget type, and interests like food, culture, adventure, or shopping.

When I submit, the frontend calls the backend. The backend sends a structured prompt to the LLM and asks for strict JSON containing summary, itinerary, budget, hotels, and creative insights. The model output is validated before saving to MongoDB.

The itinerary is generated day by day. Each day includes activities, a food suggestion, and a local tip. The budget includes flights, accommodation, food, activities, local transport, contingency, and a total estimate.

## 1:45 - 2:25 — Editable itinerary

The itinerary is not static. I can remove an activity, add a custom activity, or regenerate a specific day. For example, I can ask: “Regenerate Day 3 with more outdoor activities.”

I implemented these as narrow backend actions instead of letting the frontend overwrite the whole trip document. That keeps the data safer, easier to validate, and consistently protected by authorization checks.

## 2:25 - 2:55 — Hotel suggestions

The app also suggests hotels for the destination. Each hotel has a category, reason, estimated nightly rate, and rating hint. These are budget-aware suggestions, but I also mention in the README that real booking prices should be verified before travel.

## 2:55 - 3:30 — Custom creative feature

My custom feature is called Trip Reality Check. I added it because many AI travel planners produce attractive plans but do not explain whether the plan is actually realistic.

Trip Reality Check gives a trip fit score, budget reality check, packing tips, responsible travel tip, and trade-offs. This helps users understand whether their budget, number of days, and interests are practical together. It also makes the AI output more transparent and useful.

## 3:30 - 4:00 — Architecture and trade-offs

At a high level, the frontend is responsible for UX and protected screens. The backend owns authentication, authorization, database access, and LLM calls. API keys are never exposed to the browser.

For trade-offs, I used JWT for simple deployment, but in production I would move to HTTP-only cookies with refresh-token rotation. I also included a deterministic fallback generator so the app still works during demos if the LLM key is missing or the API is unavailable.

That’s the full flow: secure multi-user auth, AI itinerary generation, budget estimation, editable itineraries, hotels, and a custom feature focused on practical travel decision-making.
