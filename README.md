# Protein Synthesis Lab

An interactive React web app for 9th grade Biology students to learn protein synthesis, take a quiz, and receive AI-graded CER feedback.

## Setup

1. Copy the environment file and add your API key:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

## Local development

Run the full stack (frontend + API routes) with Vercel CLI:

```bash
npx vercel dev
```

Or run the frontend only (API calls will not work):

```bash
npm run dev
```

## Deploy to Vercel

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
2. Add environment variables in the Vercel project settings (see below).
3. Deploy — Vercel builds the Vite app and deploys `/api` serverless functions automatically.

## Environment variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key for AI grading |
| `TEACHER_PASSWORD` | Password for teacher dashboard (default: `teacher123`) |
| `KV_REST_API_URL` | Vercel KV URL (recommended for persistent student data in production) |
| `KV_REST_API_TOKEN` | Vercel KV token |

Without Vercel KV, student attempts are stored in `data/attempts.json` locally during development only.

## API routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/grade` | POST | AI grade CR responses and save attempt |
| `/api/teacher/verify` | POST | Verify teacher password |
| `/api/attempts` | GET | List student attempts (teacher auth) |
| `/api/attempts/export` | GET | Download attempts CSV (teacher auth) |
| `/api/health` | GET | Health check |

## Stack

- React 19 + Vite 6 + Tailwind CSS 4
- Vercel serverless functions + Anthropic SDK
- Vercel KV (optional) for attempt storage
