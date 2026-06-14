import { isTeacherAuthorized } from '../../lib/auth.js'
import { getAttempts, attemptsToCsv } from '../../lib/storage.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isTeacherAuthorized(req)) {
    return res.status(401).json({ error: 'Invalid teacher password' })
  }

  const attempts = await getAttempts()
  const csv = attemptsToCsv(attempts)

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="protein-synthesis-attempts.csv"')
  return res.status(200).send(csv)
}
