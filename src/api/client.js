async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed (${res.status})`)
  }

  if (res.headers.get('content-type')?.includes('text/csv')) {
    return res.text()
  }

  return res.json()
}

export function verifyTeacherPassword(password) {
  return request('/api/teacher/verify', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}

export function gradeAndSaveAttempt({ studentName, mcResults, crResults }) {
  return request('/api/grade', {
    method: 'POST',
    body: JSON.stringify({ studentName, mcResults, crResults }),
  })
}

export function fetchAttempts(teacherPassword) {
  return request('/api/attempts', {
    headers: { 'X-Teacher-Password': teacherPassword },
  })
}

export async function downloadAttemptsCsv(teacherPassword) {
  const res = await fetch('/api/attempts/export', {
    headers: { 'X-Teacher-Password': teacherPassword },
  })
  if (!res.ok) throw new Error('Failed to download CSV')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'protein-synthesis-attempts.csv'
  a.click()
  URL.revokeObjectURL(url)
}
