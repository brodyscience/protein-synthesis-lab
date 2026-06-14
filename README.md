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

Or run the frontend only (grading API will not work):

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

## Student data storage

Student quiz attempts are stored in the browser's localStorage on each device — there is no server-side database. Teachers can view attempts and download a CSV from the teacher dashboard on the same browser where students completed the quiz.

## API routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/grade` | POST | AI grade CR responses (returns results, does not persist) |
| `/api/teacher/verify` | POST | Verify teacher password |
| `/api/health` | GET | Health check |

## Stack

- React 19 + Vite 6 + Tailwind CSS 4
- Vercel serverless functions + Anthropic SDK
