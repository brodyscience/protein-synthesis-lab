import { scoreColorClass, scoreBgClass, formatTime } from '../../utils/scores'

function CerComponent({ label, component, color }) {
  return (
    <div className={`rounded-xl p-3 border-2 ${scoreBgClass(component.score)}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-lg" style={{ color }}>
          {label}
        </span>
        <span className={`text-2xl font-black ${scoreColorClass(component.score)}`}>
          {component.score}/4
        </span>
      </div>
      <p className="text-white/80 text-base leading-relaxed">{component.feedback}</p>
    </div>
  )
}

export default function CrGradeCard({ grade, index }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="font-black text-lab-cyan text-lg">
          Question {index + 1}: {grade.title}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-lab-orange tabular-nums">
            Time: {formatTime(grade.secondsSpent)}
          </span>
          <span className="text-lg font-black text-white">
            {grade.questionTotal}/{grade.questionMax}
          </span>
        </div>
      </div>

      {grade.tooFast && (
        <div className="rounded-xl bg-lab-pink/15 border border-lab-pink/40 p-3 mb-3">
          <p className="text-lab-pink font-bold text-base">
            {grade.tooFastMessage || 'Too fast — possible copy/paste'}
          </p>
        </div>
      )}

      <div className="rounded-xl bg-indigo-950/40 p-3 mb-3">
        <p className="text-white/80 text-base leading-relaxed whitespace-pre-wrap">
          {grade.response}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <CerComponent label="Claim" component={grade.claim} color="#fbbf24" />
        <CerComponent label="Evidence" component={grade.evidence} color="#ec4899" />
        <CerComponent label="Reasoning" component={grade.reasoning} color="#06b6d4" />
      </div>
    </div>
  )
}
