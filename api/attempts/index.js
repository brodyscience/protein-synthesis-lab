import { isTeacherAuthorized } from '../../lib/auth.js'
import { getAttempts, computeClassAverages } from '../../lib/storage.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isTeacherAuthorized(req)) {
    return res.status(401).json({ error: 'Invalid teacher password' })
  }

  const attempts = await getAttempts()
  const averages = computeClassAverages(attempts)
  return res.status(200).json({ attempts, averages })
}
