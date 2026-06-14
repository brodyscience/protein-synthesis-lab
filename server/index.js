import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { gradeConstructedResponses, buildAttemptRecord } from './grading.js'
import {
  getAttempts,
  saveAttempt,
  computeClassAverages,
  attemptsToCsv,
} from './storage.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || 'teacher123'

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

function requireTeacherAuth(req, res, next) {
  const password = req.headers['x-teacher-password']
  if (password !== TEACHER_PASSWORD) {
    return res.status(401).json({ error: 'Invalid teacher password' })
  }
  next()
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY) })
})

app.post('/api/teacher/verify', (req, res) => {
  const { password } = req.body ?? {}
  if (password === TEACHER_PASSWORD) {
    return res.json({ ok: true })
  }
  res.status(401).json({ error: 'Invalid password' })
})

app.post('/api/grade-and-save', async (req, res) => {
  try {
    const { studentName, mcResults, crResults } = req.body ?? {}

    if (!studentName?.trim()) {
      return res.status(400).json({ error: 'Student name is required' })
    }
    if (!Array.isArray(mcResults) || !Array.isArray(crResults)) {
      return res.status(400).json({ error: 'Invalid quiz results' })
    }

    const gradingResult = await gradeConstructedResponses(crResults)
    const attempt = buildAttemptRecord({ studentName: studentName.trim(), mcResults, gradingResult })
    const saved = saveAttempt(attempt)

    res.json(saved)
  } catch (err) {
    console.error('Grade and save error:', err)
    res.status(500).json({ error: err.message || 'Grading failed' })
  }
})

app.get('/api/attempts', requireTeacherAuth, (_req, res) => {
  const attempts = getAttempts()
  const averages = computeClassAverages(attempts)
  res.json({ attempts, averages })
})

app.get('/api/attempts/export.csv', requireTeacherAuth, (_req, res) => {
  const attempts = getAttempts()
  const csv = attemptsToCsv(attempts)
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="protein-synthesis-attempts.csv"')
  res.send(csv)
})

const distPath = join(__dirname, '..', 'dist')
if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(join(distPath, 'index.html'), (err) => {
      if (err) next()
    })
  })
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('Warning: ANTHROPIC_API_KEY is not set — AI grading will fail')
  }
})
