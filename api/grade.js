import { gradeConstructedResponses, buildAttemptRecord } from '../lib/grading.js'
import { randomUUID } from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { studentName, mcResults, crResults } = req.body ?? {}

    if (!studentName?.trim()) {
      return res.status(400).json({ error: 'Student name is required' })
    }
    if (!Array.isArray(mcResults) || !Array.isArray(crResults)) {
      return res.status(400).json({ error: 'Invalid quiz results' })
    }

    const gradingResult = await gradeConstructedResponses(crResults)
    const attempt = buildAttemptRecord({
      studentName: studentName.trim(),
      mcResults,
      gradingResult,
    })

    return res.status(200).json({ id: randomUUID(), ...attempt })
  } catch (err) {
    console.error('Grade error:', err)
    return res.status(500).json({ error: err.message || 'Grading failed' })
  }
}
