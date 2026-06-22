# AtlasMind AI Travel Planner

AtlasMind is a full-stack, multi-user AI travel planner built for the Full Stack Engineering Assessment. Users can register, log in, generate AI-powered itineraries, estimate budgets, edit activities, regenerate individual days, and view hotel suggestions. The application is designed with strict user data isolation so one user cannot access or modify another user's trips.

## Why this project is built this way

The assessment asks for more than a basic CRUD app. I designed AtlasMind like a small production system:

- Authentication is handled with hashed passwords and JWT access tokens.
- Every trip is stored with a `userId`, and every trip query is scoped by authenticated user ownership.
- AI responses are requested as structured JSON, validated before saving, and backed by a deterministic fallback so the app remains usable if the LLM key is missing or temporarily fails.
- The itinerary is editable through narrow API actions instead of replacing the entire document from the client.
- The UI is responsive, accessible, and component-based.
- The custom feature, **Trip Reality Check**, adds engineering judgment by surfacing budget fit, practical trade-offs, packing tips, and responsible travel advice instead of only producing a pretty itinerary.

## Tech stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React icons

### Backend

- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- bcrypt password hashing
- Zod validation
- OpenAI SDK for LLM calls

### Deployment target

Recommended deployment split:

- Frontend: Vercel
- Backend: Render, Railway, Fly.io, or any Node-compatible host
- Database: MongoDB Atlas

The frontend and backend are intentionally separated so each can scale independently and keep secrets only on the backend.

## Features checklist

| Assessment requirement | Implementation |
| --- | --- |
| Register and log in | `/api/auth/register`, `/api/auth/login`, protected frontend routes |
| Personalized dashboard | `/dashboard` lists only the logged-in user's trips |
| Trip input form | Destination, days, budget type, interests |
| AI itinerary generator | Backend LLM agent generates structured day-by-day plans |
| Budget estimation | Flights, accommodation, food, activities, local transport, contingency, total |
| Editable itinerary | Add activity, remove activity, regenerate a specific day |
| Hotel suggestions | 3 hotel recommendations with category, reason, rate, rating hint |
| Multiple users | Trip records include `userId`; all reads/writes are ownership-scoped |
| Deployment-ready | `.env.example` files and production build scripts included |
| Creative feature | Trip Reality Check: fit score, budget reality check, trade-offs, packing tips, responsible travel tip |

## Monorepo structure

```txt
ai-travel-planner-assessment/
├── backend/
│   ├── src/
│   │   ├── config/          # env and database setup
│   │   ├── controllers/     # request handlers
│   │   ├── middleware/      # auth and error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routes
│   │   ├── services/        # AI planner and token services
│   │   ├── types/           # shared backend types
│   │   └── utils/           # reusable helpers
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # reusable UI and trip components
│   ├── lib/                 # API client and frontend types
│   ├── .env.example
│   └── package.json
├── docs/
│   └── walkthrough-video-script.md
└── README.md
```

## Local setup

### 1. Clone and install

```bash
git clone <your-repository-url>
cd ai-travel-planner-assessment
npm run install:all
```

### 2. Configure backend environment

Create `backend/.env` from `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

Example backend `.env`:

```env
NODE_ENV=development
PORT=8080
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/ai-travel-planner
JWT_SECRET=replace-this-with-a-long-random-secret-of-at-least-32-characters
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
```

`OPENAI_API_KEY` is optional for local testing. If it is missing, the backend uses a deterministic fallback itinerary generator so the application still works.

### 3. Configure frontend environment

Create `frontend/.env.local` from `frontend/.env.example`:

```bash
cp frontend/.env.example frontend/.env.local
```

Example frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 4. Start MongoDB

Use a local MongoDB server or MongoDB Atlas. For local development, make sure MongoDB is running at the URI configured in `backend/.env`.

### 5. Run the app locally

From the root folder:

```bash
npm run dev
```

The app will run at:

- Frontend: `http://localhost:3000`
- Backend health check: `http://localhost:8080/health`

## Backend API overview

### Auth routes

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create account and return JWT |
| POST | `/api/auth/login` | Login and return JWT |
| GET | `/api/auth/me` | Return current authenticated user |

### Trip routes

All trip routes require `Authorization: Bearer <token>`.

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/trips` | List only the logged-in user's trips |
| POST | `/api/trips` | Generate and save a new AI trip |
| GET | `/api/trips/:id` | Fetch one owned trip |
| DELETE | `/api/trips/:id` | Delete one owned trip |
| PATCH | `/api/trips/:id/activities` | Add an activity to a day |
| DELETE | `/api/trips/:id/activities` | Remove an activity from a day |
| POST | `/api/trips/:id/regenerate-day` | Regenerate a specific day with user instructions |

## Authentication and authorization approach

1. User registers with name, email, and password.
2. Password is hashed with bcrypt before being stored.
3. Login validates the password and returns a signed JWT.
4. The frontend stores the token in local storage and sends it in the `Authorization` header.
5. Backend middleware verifies the token and attaches `req.user.id`.
6. Every trip query includes both `_id` and `userId`, for example:

```ts
Trip.findOne({ _id: tripId, userId: req.user.id })
```

This prevents horizontal privilege escalation. Even if a user guesses another trip ID, the query will not return it unless the authenticated user owns it.

## AI agent design

The AI planner is implemented in `backend/src/services/aiPlannerService.ts`.

The agent receives:

- Destination
- Number of days
- Budget type
- Interests

It returns structured JSON containing:

- Trip summary
- Day-by-day itinerary
- Budget breakdown
- Hotel suggestions
- Trip Reality Check insights

Important engineering decisions:

- The backend, not the frontend, owns all LLM calls so API keys never reach the browser.
- The prompt asks for strict JSON only.
- Zod validates the model output before it is saved.
- The total budget is recomputed server-side to avoid inconsistent math.
- A deterministic fallback is included for reliability and easier demos.

## Creative/custom feature: Trip Reality Check

Most AI itinerary tools generate attractive plans but do not explain whether the plan is realistic. I added **Trip Reality Check** to solve that problem.

It includes:

- Trip fit score
- Budget reality check
- Packing tips
- Responsible travel tip
- Trade-offs, such as commute fatigue or lower hotel quality on a low budget

This feature shows engineering judgment because it helps the user make better decisions, not just receive generated text. It also makes the LLM output more useful, transparent, and responsible.

## Key design decisions and trade-offs

### Separate frontend and backend

I used a separate Express backend instead of calling the LLM directly from Next.js because authentication, authorization, database ownership checks, and API key security are clearer on the server.

### JWT instead of sessions

JWT keeps deployment simple for separate frontend/backend hosting. The trade-off is that token revocation is more complex than server-side sessions. For a production system, I would add refresh tokens, token rotation, and secure HTTP-only cookies.

### Local storage for token

Local storage is simple for an assessment demo. In production, I would move tokens to secure, HTTP-only cookies to reduce XSS impact.

### Deterministic AI fallback

The fallback ensures the app can still be evaluated without a paid LLM key. The trade-off is that fallback output is less personalized than a live model response.

### Editable day-level operations

I used specific update actions, such as add activity and regenerate day, instead of letting the client overwrite the whole trip. This reduces accidental data loss and keeps authorization centralized.

## Known limitations

- Hotel suggestions are AI-generated and should be verified against live booking sites before travel.
- Budget estimates are approximate and do not use live flight or hotel pricing APIs.
- The current demo stores JWT in local storage; production should use HTTP-only cookies and refresh-token rotation.
- The app does not yet include password reset, email verification, or social login.
- The LLM output depends on model availability and prompt quality, so validation and fallback are included.

## Deployment instructions

### Backend deployment

1. Deploy `backend/` as a Node.js service.
2. Build command:

```bash
npm install && npm run build
```

3. Start command:

```bash
npm start
```

4. Add environment variables:

```env
NODE_ENV=production
PORT=8080
CLIENT_URL=https://your-frontend-domain.com
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-long-production-secret
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
```

5. Confirm `/health` returns `{ "status": "ok" }`.

### Frontend deployment

1. Deploy `frontend/` as the Next.js app.
2. Build command:

```bash
npm install && npm run build
```

3. Add environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

4. Redeploy after updating the backend URL.

## Suggested Git commit history

A strong assessment submission should not be one giant final commit. Suggested commits:

```bash
git add .
git commit -m "Initialize full-stack travel planner monorepo"

git add backend
git commit -m "Add Express API with auth and MongoDB models"

git add backend/src/services backend/src/controllers/tripController.ts
git commit -m "Implement AI itinerary generation and trip editing APIs"

git add frontend
git commit -m "Build Next.js dashboard and itinerary editor UI"

git add README.md docs
git commit -m "Document architecture deployment and walkthrough"
```



