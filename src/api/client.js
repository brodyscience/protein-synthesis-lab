async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed (${res.status})`)
  }

  return res.json()
}

export function verifyTeacherPassword(password) {
  return request('/api/teacher/verify', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}

export function gradeAttempt({ studentName, mcResults, crResults }) {
  return request('/api/grade', {
    method: 'POST',
    body: JSON.stringify({ studentName, mcResults, crResults }),
  })
}
