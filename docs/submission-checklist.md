# Submission Checklist

Use this before sending the assessment.

## Required links

- GitHub repository: `https://github.com/<username>/<repo-name>`
- Frontend deployment: `https://<your-app>.vercel.app`
- Backend health URL: `https://<your-api-host>/health`
- Walkthrough video link: Google Drive, Loom, or YouTube unlisted

## Before recording the video

1. Register a fresh user.
2. Create one trip, for example: Tokyo, 3 days, Medium budget, Food + Culture + Shopping.
3. Open the generated trip page.
4. Add one custom activity.
5. Remove one activity.
6. Regenerate one day with: `Regenerate Day 3 with more outdoor activities`.
7. Show budget, hotel suggestions, and Trip Reality Check.
8. Mention strict data isolation: every trip query is scoped by `userId`.

## Before submitting the GitHub repo

- Do not commit `.env` files.
- Commit `.env.example` files only.
- Make sure `README.md` includes setup, deployment, architecture, auth, AI design, creative feature, trade-offs, and limitations.
- Make sure the deployed frontend points to the deployed backend through `NEXT_PUBLIC_API_URL`.
- Make sure the backend `CLIENT_URL` matches the deployed frontend URL.
- Make sure MongoDB Atlas network access allows the backend host.
- Make sure the OpenAI API key is stored only in backend environment variables.
