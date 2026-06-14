import { MC_QUESTIONS } from '../../data/quizQuestions'
import CrGradeCard from './CrGradeCard'
import { scoreColorClass } from '../../utils/scores'

export default function QuizResults({ attempt, mcResults, gradingError, onTryAgain, onBack }) {
  if (gradingError) {
    return (
      <div className="space-y-6 pb-8">
        <div className="game-card rounded-3xl p-8 text-center border-2 border-lab-pink/40">
          <h2 className="text-2xl font-black text-lab-pink mb-2">Grading failed</h2>
          <p className="text-white/80 text-lg">{gradingError}</p>
          <p className="text-white/50 text-base mt-2">
            Make sure the server is running and ANTHROPIC_API_KEY is set.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={onTryAgain} className="btn-game px-8 py-3 rounded-2xl font-black text-indigo-900 text-xl">
            Try again
          </button>
          <button
            onClick={onBack}
            className="px-8 py-3 rounded-2xl font-bold text-white/80 border-2 border-white/20 hover:border-white/40"
          >
            ← Back to review
          </button>
        </div>
      </div>
    )
  }

  if (!attempt) return null

  const mcScore = attempt.mcScore
  const mcTotal = attempt.mcTotal

  return (
    <div className="space-y-6 pb-8">
      {/* Combined score hero */}
      <div className="game-card rounded-3xl p-6 sm:p-8 text-center animate-pop-in">
        <p className="text-lg font-bold text-white/60 mb-1">Total score</p>
        <div className={`text-6xl font-black ${scoreColorClass((attempt.combinedTotal / attempt.combinedMax) * 4)}`}>
          {attempt.combinedTotal}/{attempt.combinedMax}
        </div>
        <p className="text-white/70 text-lg mt-2">
          MC {mcScore}/{mcTotal} + CR {attempt.crTotal}/{attempt.crMax}
        </p>
      </div>

      {/* Performance summary */}
      <div className="game-card rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-black text-white mb-4">Performance summary</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-lab-lime/30 bg-lab-lime/5 p-4">
            <p className="text-lg font-bold text-lab-lime mb-2">Strengths</p>
            <ul className="space-y-1">
              {(attempt.summary?.strengths ?? []).map((s, i) => (
                <li key={i} className="text-white/85 text-base">• {s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-lab-yellow/30 bg-lab-yellow/5 p-4">
            <p className="text-lg font-bold text-lab-yellow mb-2">Areas to improve</p>
            <ul className="space-y-1">
              {(attempt.summary?.areasToImprove ?? []).map((s, i) => (
                <li key={i} className="text-white/85 text-base">• {s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* MC results */}
      <div className="game-card rounded-3xl p-6 sm:p-8">
        <p className="text-lg font-bold text-lab-yellow mb-2">Part A — Multiple choice</p>
        <div className={`text-4xl font-black ${scoreColorClass((mcScore / mcTotal) * 4)} mb-4`}>
          {mcScore}/{mcTotal}
        </div>
        <div className="space-y-2">
          {MC_QUESTIONS.map((q, i) => {
            const result = mcResults?.[i]
            const correct = result?.correct
            return (
              <div
                key={q.id}
                className={`flex items-start gap-3 rounded-xl p-3 border ${
                  correct ? 'border-lab-lime/30 bg-lab-lime/5' : 'border-lab-pink/30 bg-lab-pink/5'
                }`}
              >
                <span className={`text-lg font-black ${correct ? 'text-lab-lime' : 'text-lab-pink'}`}>
                  {correct ? 'Correct' : 'Incorrect'}
                </span>
                <div>
                  <p className="text-white/70 text-base font-bold">Question {i + 1}</p>
                  {!correct && (
                    <p className="text-lab-lime text-base mt-1 font-semibold">
                      Correct: {q.choices[q.correctIndex]}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CR component totals */}
      <div className="game-card rounded-3xl p-6 sm:p-8">
        <p className="text-lg font-bold text-lab-cyan mb-4">Part B — Constructed response breakdown</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Claim', total: attempt.crClaimTotal, max: attempt.crGrades.length * 4, color: '#fbbf24' },
            { label: 'Evidence', total: attempt.crEvidenceTotal, max: attempt.crGrades.length * 4, color: '#ec4899' },
            { label: 'Reasoning', total: attempt.crReasoningTotal, max: attempt.crGrades.length * 4, color: '#06b6d4' },
          ].map(({ label, total, max, color }) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <p className="font-bold text-base" style={{ color }}>{label}</p>
              <p className={`text-2xl font-black ${scoreColorClass((total / max) * 4)}`}>
                {total}/{max}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {attempt.crGrades.map((grade, i) => (
            <CrGradeCard key={grade.questionId} grade={grade} index={i} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button onClick={onTryAgain} className="btn-game px-8 py-3 rounded-2xl font-black text-indigo-900 text-xl">
          Try again
        </button>
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-2xl text-lg font-bold text-white/80 border-2 border-white/20 hover:border-white/40"
        >
          ← Back to review
        </button>
      </div>
    </div>
  )
}
