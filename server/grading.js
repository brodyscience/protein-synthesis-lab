import Anthropic from '@anthropic-ai/sdk'

const MODEL = 'claude-haiku-4-5-20251001'
const TOO_FAST_THRESHOLD = 15
const TOO_FAST_PENALTY = 1

const GRADING_PROMPT = `You are an expert 9th grade Biology teacher grading constructed responses using the NYS NYSSLS Science and Engineering Practices (SEP) framework.

Grade each student response on a 4-point rubric for three components:
- **Claim** (0-4): Does the student make a clear, accurate scientific claim that answers the question?
- **Evidence** (0-4): Does the student cite specific evidence from the scenario, data table, or diagram provided?
- **Reasoning** (0-4): Does the student logically connect the evidence to the claim using correct science vocabulary?

Scoring guide:
- 0-1: Missing, incorrect, or irrelevant
- 2-3: Partially correct, incomplete, or lacks detail
- 4: Complete, accurate, and well-articulated

Topic: Protein synthesis (transcription, translation, mRNA, ribosomes, codons, amino acids).

Respond with ONLY valid JSON (no markdown fences) in this exact shape:
{
  "grades": [
    {
      "questionId": "<id>",
      "claim": { "score": 0, "feedback": "specific feedback" },
      "evidence": { "score": 0, "feedback": "specific feedback" },
      "reasoning": { "score": 0, "feedback": "specific feedback" }
    }
  ],
  "summary": {
    "strengths": ["strength 1", "strength 2"],
    "areasToImprove": ["area 1", "area 2"]
  }
}`

function applyTooFastPenalty(grade, secondsSpent) {
  const tooFast = secondsSpent < TOO_FAST_THRESHOLD
  if (!tooFast) {
    return { ...grade, tooFast: false }
  }

  const penalize = (component) => ({
    ...component,
    score: Math.max(0, component.score - TOO_FAST_PENALTY),
    feedback: `${component.feedback} Warning: Response submitted in under ${TOO_FAST_THRESHOLD} seconds — possible copy/paste. ${TOO_FAST_PENALTY} point deducted.`,
  })

  return {
    ...grade,
    tooFast: true,
    tooFastMessage: `Too fast — possible copy/paste (${secondsSpent}s)`,
    claim: penalize(grade.claim),
    evidence: penalize(grade.evidence),
    reasoning: penalize(grade.reasoning),
  }
}

function questionTotal(grade) {
  return grade.claim.score + grade.evidence.score + grade.reasoning.score
}

export async function gradeConstructedResponses(responses) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured on the server')
  }

  const anthropic = new Anthropic({ apiKey })

  const questionsBlock = responses
    .map(
      (r, i) => `
Question ${i + 1} (id: ${r.questionId})
Title: ${r.title}
${r.scenario ? `Scenario: ${r.scenario}` : ''}
${r.dataTable ? `Data: ${JSON.stringify(r.dataTable)}` : ''}
Prompt: ${r.prompt}
Student response:
"""
${r.response}
"""`,
    )
    .join('\n---\n')

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `${GRADING_PROMPT}\n\nGrade these responses:\n${questionsBlock}`,
      },
    ],
  })

  const text = message.content.find((b) => b.type === 'text')?.text ?? ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('AI grading returned an invalid response format')
  }

  const parsed = JSON.parse(jsonMatch[0])
  const gradeMap = new Map(parsed.grades.map((g) => [g.questionId, g]))

  const gradedResponses = responses.map((r) => {
    const aiGrade = gradeMap.get(r.questionId)
    if (!aiGrade) {
      throw new Error(`Missing grade for question ${r.questionId}`)
    }

    const base = {
      questionId: r.questionId,
      title: r.title,
      response: r.response,
      secondsSpent: r.secondsSpent,
      claim: aiGrade.claim,
      evidence: aiGrade.evidence,
      reasoning: aiGrade.reasoning,
    }

    const withPenalty = applyTooFastPenalty(base, r.secondsSpent)
    return {
      ...withPenalty,
      questionTotal: questionTotal(withPenalty),
      questionMax: 12,
    }
  })

  const crClaimTotal = gradedResponses.reduce((s, g) => s + g.claim.score, 0)
  const crEvidenceTotal = gradedResponses.reduce((s, g) => s + g.evidence.score, 0)
  const crReasoningTotal = gradedResponses.reduce((s, g) => s + g.reasoning.score, 0)
  const crTotal = crClaimTotal + crEvidenceTotal + crReasoningTotal
  const crMax = gradedResponses.length * 12

  return {
    crGrades: gradedResponses,
    crClaimTotal,
    crEvidenceTotal,
    crReasoningTotal,
    crTotal,
    crMax,
    summary: parsed.summary ?? { strengths: [], areasToImprove: [] },
  }
}

export function buildAttemptRecord({ studentName, mcResults, gradingResult }) {
  const mcScore = mcResults.filter((r) => r.correct).length
  const mcTotal = mcResults.length
  const combinedTotal = mcScore + gradingResult.crTotal
  const combinedMax = mcTotal + gradingResult.crMax

  return {
    studentName,
    timestamp: new Date().toISOString(),
    topic: 'Protein Synthesis',
    mcScore,
    mcTotal,
    crGrades: gradingResult.crGrades,
    crClaimTotal: gradingResult.crClaimTotal,
    crEvidenceTotal: gradingResult.crEvidenceTotal,
    crReasoningTotal: gradingResult.crReasoningTotal,
    crTotal: gradingResult.crTotal,
    crMax: gradingResult.crMax,
    combinedTotal,
    combinedMax,
    summary: gradingResult.summary,
  }
}
