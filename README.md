# Protein Synthesis Lab

An interactive React web app for 9th grade Biology students to learn protein synthesis, take a quiz, and receive AI-graded CER feedback.

## Setup

1. Copy the environment file and add your API key:

```bash
cp .env.example .env
# Edit .env and set ANTHROPIC_API_KEY
```

2. Install dependencies:

```bash
npm install
```

3. Run the app (frontend + backend):

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Features

### Review
- Animated walkthrough of protein synthesis (3 sections)
- Interactive cell diagram and step-by-step process

### Quiz
- Part A: 5 Regents-style multiple choice questions
- Part B: 2 CER constructed response questions (paste disabled, timed)
- AI grading via Claude (`claude-haiku-4-5-20251001`) on a 4-point Claim / Evidence / Reasoning rubric
- Responses under 15 seconds flagged as possible copy/paste with point deductions
- Results page with MC score, CR breakdown, combined total, and performance summary

### Teacher Dashboard
- Password: `teacher123` (configurable via `TEACHER_PASSWORD` in `.env`)
- View all student attempts in a sortable table
- Class averages per component
- Download all data as CSV

## Production

```bash
npm run build
npm start
```

The Express server serves the built frontend and handles API routes.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key for AI grading |
| `TEACHER_PASSWORD` | Password for teacher dashboard (default: `teacher123`) |
| `PORT` | Server port (default: `3001`) |

## Stack

- React 19 + Vite 6 + Tailwind CSS 4
- Express backend with Anthropic SDK
- JSON file storage for student attempts
