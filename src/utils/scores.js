export function scoreColorClass(score) {
  if (score >= 4) return 'text-lab-lime'
  if (score >= 2) return 'text-lab-yellow'
  return 'text-lab-pink'
}

export function scoreBgClass(score) {
  if (score >= 4) return 'border-lab-lime/40 bg-lab-lime/10'
  if (score >= 2) return 'border-lab-yellow/40 bg-lab-yellow/10'
  return 'border-lab-pink/40 bg-lab-pink/10'
}

export function scoreLabel(score) {
  if (score >= 4) return 'Strong'
  if (score >= 2) return 'Developing'
  return 'Needs work'
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
}

export function formatDate(iso) {
  return new Date(iso).toLocaleString()
}
