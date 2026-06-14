import { useState, useEffect, useRef } from 'react'
import { CR_QUESTIONS } from '../../data/quizQuestions'

function DataTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-lab-cyan/30 my-4">
      <table className="w-full text-lg">
        <thead>
          <tr className="bg-lab-cyan/10">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-bold text-lab-cyan border-b border-lab-cyan/20">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white/5' : 'bg-white/2'}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-white/85 font-semibold border-b border-white/5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function useQuestionTimer(questionIndex) {
  const [seconds, setSeconds] = useState(0)
  const secondsRef = useRef(0)

  useEffect(() => {
    setSeconds(0)
    secondsRef.current = 0
    const interval = setInterval(() => {
      secondsRef.current += 1
      setSeconds(secondsRef.current)
    }, 1000)
    return () => clearInterval(interval)
  }, [questionIndex])

  return { seconds, getElapsed: () => secondsRef.current }
}

export default function ConstructedResponsePart({ onComplete }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [response, setResponse] = useState('')
  const [results, setResults] = useState([])
  const { seconds, getElapsed } = useQuestionTimer(currentQ)

  const question = CR_QUESTIONS[currentQ]
  const isLast = currentQ === CR_QUESTIONS.length - 1

  const handlePaste = (e) => {
    e.preventDefault()
  }

  const handleSubmit = () => {
    const timeSpent = getElapsed()
    const entry = {
      questionId: question.id,
      title: question.title,
      response: response.trim(),
      secondsSpent: timeSpent,
    }
    const updated = [...results, entry]

    if (isLast) {
      onComplete(updated)
    } else {
      setResults(updated)
      setCurrentQ((q) => q + 1)
      setResponse('')
    }
  }

  const formatTime = (s) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  return (
    <div className="game-card rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-lab-cyan text-lg font-bold">
          Question {currentQ + 1} of {CR_QUESTIONS.length}
        </span>
        <span className="text-lg font-bold text-lab-orange tabular-nums">
          Time: {formatTime(seconds)}
        </span>
      </div>

      <div className="flex gap-1 mb-6">
        {CR_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i < currentQ ? 'bg-lab-cyan' : i === currentQ ? 'bg-lab-yellow' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <h3 className="text-2xl font-black text-lab-yellow mb-3">{question.title}</h3>

      {question.scenario && (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-4">
          <p className="text-base font-bold text-white/50 mb-2">Scenario</p>
          <p className="text-white/85 text-lg leading-relaxed">{question.scenario}</p>
        </div>
      )}

      {question.dataTable && (
        <DataTable headers={question.dataTable.headers} rows={question.dataTable.rows} />
      )}

      <p className="text-white font-bold text-lg leading-relaxed mb-4">{question.prompt}</p>

      <div className="rounded-xl bg-lab-purple/20 border border-lab-purple/40 p-4 mb-4">
        <p className="text-base font-bold text-lab-purple mb-2">CER format reminder</p>
        <div className="flex flex-wrap gap-2 text-base font-bold">
          <span className="px-3 py-1 rounded-lg bg-lab-yellow/20 text-lab-yellow">C — Claim</span>
          <span className="px-3 py-1 rounded-lg bg-lab-pink/20 text-lab-pink">E — Evidence</span>
          <span className="px-3 py-1 rounded-lg bg-lab-cyan/20 text-lab-cyan">R — Reasoning</span>
        </div>
        <p className="text-white/50 text-base mt-2">{question.cerHint}</p>
      </div>

      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        onPaste={handlePaste}
        placeholder="Type your CER response here… (pasting is disabled)"
        rows={8}
        className="w-full rounded-2xl bg-indigo-950/60 border-2 border-white/15 focus:border-lab-cyan focus:outline-none p-4 text-white text-lg leading-relaxed resize-y placeholder:text-white/30"
      />
      <p className="text-white/30 text-base mt-1">
        Paste is disabled — write your answer in your own words.
      </p>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!response.trim()}
          className="btn-game px-8 py-3 rounded-2xl font-black text-indigo-900 text-xl"
        >
          {isLast ? 'Submit & see results →' : 'Submit answer →'}
        </button>
      </div>
    </div>
  )
}
