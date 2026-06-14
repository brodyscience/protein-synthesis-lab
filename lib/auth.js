export function getTeacherPassword() {
  return process.env.TEACHER_PASSWORD || 'teacher123'
}

export function isTeacherAuthorized(req) {
  return req.headers['x-teacher-password'] === getTeacherPassword()
}

export function getTeacherPasswordFromBody(body) {
  return body?.password === getTeacherPassword()
}
