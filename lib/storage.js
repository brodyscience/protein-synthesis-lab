import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'

const ATTEMPTS_KEY = 'attempts'
const LOCAL_ATTEMPTS_FILE = join(process.cwd(), 'data', 'attempts.json')

function ensureLocalFile() {
  const dir = join(process.cwd(), 'data')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  if (!existsSync(LOCAL_ATTEMPTS_FILE)) {
    writeFileSync(LOCAL_ATTEMPTS_FILE, '[]', 'utf-8')
  }
}

async function useKv() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

async function readAttemptsFromStore() {
  if (await useKv()) {
    const { kv } = await import('@vercel/kv')
    return (await kv.get(ATTEMPTS_KEY)) ?? []
  }

  ensureLocalFile()
  return JSON.parse(readFileSync(LOCAL_ATTEMPTS_FILE, 'utf-8'))
}

async function writeAttemptsToStore(attempts) {
  if (await useKv()) {
    const { kv } = await import('@vercel/kv')
    await kv.set(ATTEMPTS_KEY, attempts)
    return
  }

  ensureLocalFile()
  writeFileSync(LOCAL_ATTEMPTS_FILE, JSON.stringify(attempts, null, 2), 'utf-8')
}

export async function getAttempts() {
  return readAttemptsFromStore()
}

export async function saveAttempt(attempt) {
  const attempts = await readAttemptsFromStore()
  const record = { id: randomUUID(), ...attempt }
  attempts.push(record)
  await writeAttemptsToStore(attempts)
  return record
}

export function computeClassAverages(attempts) {
  if (attempts.length === 0) {
    return {
      mcScore: 0,
      crClaim: 0,
      crEvidence: 0,
      crReasoning: 0,
      crTotal: 0,
      combinedTotal: 0,
      count: 0,
    }
  }

  const sum = attempts.reduce(
    (acc, a) => ({
      mcScore: acc.mcScore + (a.mcScore ?? 0),
      crClaim: acc.crClaim + (a.crClaimTotal ?? 0),
      crEvidence: acc.crEvidence + (a.crEvidenceTotal ?? 0),
      crReasoning: acc.crReasoning + (a.crReasoningTotal ?? 0),
      crTotal: acc.crTotal + (a.crTotal ?? 0),
      combinedTotal: acc.combinedTotal + (a.combinedTotal ?? 0),
    }),
    { mcScore: 0, crClaim: 0, crEvidence: 0, crReasoning: 0, crTotal: 0, combinedTotal: 0 },
  )

  const n = attempts.length
  return {
    mcScore: sum.mcScore / n,
    crClaim: sum.crClaim / n,
    crEvidence: sum.crEvidence / n,
    crReasoning: sum.crReasoning / n,
    crTotal: sum.crTotal / n,
    combinedTotal: sum.combinedTotal / n,
    count: n,
  }
}

export function attemptsToCsv(attempts) {
  const headers = [
    'Student Name',
    'Timestamp',
    'Topic',
    'MC Score',
    'MC Total',
    'CR Claim Total',
    'CR Evidence Total',
    'CR Reasoning Total',
    'CR Total',
    'CR Max',
    'Combined Total',
    'Combined Max',
    'CR1 Time (sec)',
    'CR1 Claim',
    'CR1 Evidence',
    'CR1 Reasoning',
    'CR1 Too Fast',
    'CR2 Time (sec)',
    'CR2 Claim',
    'CR2 Evidence',
    'CR2 Reasoning',
    'CR2 Too Fast',
    'Strengths',
    'Areas to Improve',
  ]

  const rows = attempts.map((a) => {
    const cr1 = a.crGrades?.[0] ?? {}
    const cr2 = a.crGrades?.[1] ?? {}
    return [
      a.studentName,
      a.timestamp,
      a.topic,
      a.mcScore,
      a.mcTotal,
      a.crClaimTotal,
      a.crEvidenceTotal,
      a.crReasoningTotal,
      a.crTotal,
      a.crMax,
      a.combinedTotal,
      a.combinedMax,
      cr1.secondsSpent ?? '',
      cr1.claim?.score ?? '',
      cr1.evidence?.score ?? '',
      cr1.reasoning?.score ?? '',
      cr1.tooFast ? 'Yes' : 'No',
      cr2.secondsSpent ?? '',
      cr2.claim?.score ?? '',
      cr2.evidence?.score ?? '',
      cr2.reasoning?.score ?? '',
      cr2.tooFast ? 'Yes' : 'No',
      (a.summary?.strengths ?? []).join('; '),
      (a.summary?.areasToImprove ?? []).join('; '),
    ]
  })

  const escape = (val) => {
    const str = String(val ?? '')
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  return [headers.join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n')
}
