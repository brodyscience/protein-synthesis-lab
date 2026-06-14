import { useState } from 'react'
import { MC_QUESTIONS } from '../../data/quizQuestions'

const CHOICE_LABELS = ['A', 'B', 'C', 'D']

export default function MultipleChoicePart({ onComplete }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [results, setResults] = useState([])

  const question = MC_QUESTIONS[currentQ]
  const isCorrect = selected === question.correctIndex
  const isLast = currentQ === MC_QUESTIONS.length - 1
  const score = results.filter((r) => r.correct).length

  const handleSelect = (index) => {
    if (answered) return
    setSelected(index)
    setAnswered(true)
    setResults((prev) => [
      ...prev,
      {
        questionId: question.id,
        selectedIndex: index,
        correctIndex: question.correctIndex,
        correct: index === question.correctIndex,
      },
    ])
  }

  const handleNext = () => {
    if (isLast) {
      onComplete(results)
      return
    }
    setCurrentQ((q) => q + 1)
    setSelected(null)
    setAnswered(false)
  }

  return (
    <div className="game-card rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <span className="text-lab-yellow text-lg font-bold">
          Question {currentQ + 1} of {MC_QUESTIONS.length}
        </span>
        <span className="text-lg font-bold text-lab-lime">
          Score: {score}/{results.length}
        </span>
      </div>

      <div className="flex gap-1 mb-6">
        {MC_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all ${
              i < currentQ
                ? results[i]?.correct
                  ? 'bg-lab-lime'
                  : 'bg-lab-pink'
                : i === currentQ
                  ? 'bg-lab-yellow'
                  : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <p className="text-xl font-bold text-white leading-relaxed mb-6 animate-slide-in-right">
        {question.question}
      </p>

      <div className="space-y-3">
        {question.choices.map((choice, index) => {
          let style = 'border-white/20 bg-white/5 hover:border-white/40'
          if (answered) {
            if (index === question.correctIndex) {
              style = 'border-lab-lime bg-lab-lime/20 shadow-[0_0_16px_rgba(132,204,22,0.3)]'
            } else if (index === selected && !isCorrect) {
              style = 'border-lab-pink bg-lab-pink/20 shadow-[0_0_16px_rgba(236,72,153,0.3)]'
            } else {
              style = 'border-white/10 bg-white/5 opacity-50'
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={answered}
              className={`w-full text-left flex items-start gap-3 p-4 rounded-2xl border-2 transition-all ${style} disabled:cursor-default`}
            >
              <span
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
                  answered && index === question.correctIndex
                    ? 'bg-lab-lime text-indigo-900'
                    : answered && index === selected && !isCorrect
                      ? 'bg-lab-pink text-white'
                      : 'bg-white/10 text-lab-yellow'
                }`}
              >
                {CHOICE_LABELS[index]}
              </span>
              <span className="text-white/90 font-semibold text-lg leading-relaxed pt-1">
                {choice}
              </span>
            </button>
          )
        })}
      </div>

      {answered && (
        <div
          className={`mt-6 rounded-2xl p-4 border-2 animate-pop-in ${
            isCorrect
              ? 'border-lab-lime bg-lab-lime/10'
              : 'border-lab-pink bg-lab-pink/10'
          }`}
        >
          <p className={`font-black text-xl mb-1 ${isCorrect ? 'text-lab-lime' : 'text-lab-pink'}`}>
            {isCorrect ? 'Correct!' : 'Not quite'}
          </p>
          <p className="text-white/80 text-lg leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {answered && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNext}
            className="btn-game px-8 py-3 rounded-2xl font-black text-indigo-900 text-xl"
          >
            {isLast ? 'Continue to Part B →' : 'Next question →'}
          </button>
        </div>
      )}
    </div>
  )
}
