import { useState } from 'react'
import ProgressBar from '../ProgressBar'
import StudentNameGate from './StudentNameGate'
import MultipleChoicePart from './MultipleChoicePart'
import ConstructedResponsePart from './ConstructedResponsePart'
import QuizResults from './QuizResults'
import GradingLoader from './GradingLoader'
import { gradeAttempt } from '../../api/client'
import { saveAttempt } from '../../utils/attempts'
import { CR_QUESTIONS } from '../../data/quizQuestions'

const PHASE = {
  NAME: 0,
  MC: 1,
  CR: 2,
  GRADING: 3,
  RESULTS: 4,
}

export default function Quiz({ onBack }) {
  const [phase, setPhase] = useState(PHASE.NAME)
  const [studentName, setStudentName] = useState('')
  const [mcResults, setMcResults] = useState(null)
  const [crResults, setCrResults] = useState(null)
  const [attempt, setAttempt] = useState(null)
  const [gradingError, setGradingError] = useState(null)
  const [quizKey, setQuizKey] = useState(0)

  const handleMcComplete = (results) => {
    setMcResults(results)
    setPhase(PHASE.CR)
  }

  const handleCrComplete = async (results) => {
    setCrResults(results)
    setPhase(PHASE.GRADING)
    setGradingError(null)

    try {
      const enrichedCr = results.map((r) => {
        const q = CR_QUESTIONS.find((q) => q.id === r.questionId)
        return {
          ...r,
          prompt: q.prompt,
          scenario: q.scenario,
          dataTable: q.dataTable,
        }
      })

      const graded = await gradeAttempt({
        studentName,
        mcResults,
        crResults: enrichedCr,
      })
      const saved = saveAttempt(graded)
      setAttempt(saved)
      setPhase(PHASE.RESULTS)
    } catch (err) {
      setGradingError(err.message)
      setPhase(PHASE.RESULTS)
    }
  }

  const handleTryAgain = () => {
    setPhase(PHASE.NAME)
    setStudentName('')
    setMcResults(null)
    setCrResults(null)
    setAttempt(null)
    setGradingError(null)
    setQuizKey((k) => k + 1)
  }

  const progressPhase = phase === PHASE.MC ? 0 : phase === PHASE.CR ? 1 : null

  return (
    <div key={quizKey} className="min-h-screen flex flex-col max-w-3xl mx-auto">
      <header className="pt-6 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-lab-cyan/20 border border-lab-cyan/40 rounded-full px-5 py-1.5 mb-3">
          <span className="text-lg font-bold text-lab-cyan">
            🧪 Quiz Time
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
          {phase === PHASE.NAME && 'Get ready'}
          {phase === PHASE.MC && 'Part A — Multiple choice'}
          {phase === PHASE.CR && 'Part B — Constructed response'}
          {phase === PHASE.GRADING && 'Grading your responses…'}
          {phase === PHASE.RESULTS && 'Your results'}
        </h1>
        <p className="text-white/60 text-lg font-semibold">
          {phase === PHASE.NAME && 'Enter your name to begin the quiz'}
          {phase === PHASE.MC && '5 Regents-style questions — pick the best answer'}
          {phase === PHASE.CR && '2 CER responses — type your own answers (no paste!)'}
          {phase === PHASE.GRADING && 'AI is reviewing your Claim, Evidence, and Reasoning'}
          {phase === PHASE.RESULTS && (studentName ? `${studentName} — review your performance` : 'Review your performance')}
        </p>
      </header>

      {progressPhase !== null && (
        <ProgressBar
          current={progressPhase}
          total={2}
          labels={['Multiple choice', 'Constructed response']}
        />
      )}

      <main className="flex-1 px-4 py-6">
        {phase === PHASE.NAME && (
          <StudentNameGate onSubmit={(name) => { setStudentName(name); setPhase(PHASE.MC) }} />
        )}
        {phase === PHASE.MC && <MultipleChoicePart onComplete={handleMcComplete} />}
        {phase === PHASE.CR && <ConstructedResponsePart onComplete={handleCrComplete} />}
        {phase === PHASE.GRADING && <GradingLoader />}
        {phase === PHASE.RESULTS && (
          <QuizResults
            attempt={attempt}
            mcResults={mcResults}
            gradingError={gradingError}
            onTryAgain={handleTryAgain}
            onBack={onBack}
          />
        )}
      </main>
    </div>
  )
}
