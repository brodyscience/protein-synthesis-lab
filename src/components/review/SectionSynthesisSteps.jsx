import { useState, useEffect } from 'react'

const STEPS = [
  {
    id: 'dna',
    label: 'DNA',
    color: '#a78bfa',
    title: 'Step 1: DNA Holds the Code',
    text: 'Inside the nucleus, DNA contains the recipe for making proteins. A specific section of DNA (a gene) will be used.',
  },
  {
    id: 'transcription',
    label: 'Transcription',
    color: '#ec4899',
    title: 'Step 2: Transcription',
    text: 'The cell copies one gene from DNA into a messenger molecule called mRNA. This happens inside the nucleus.',
  },
  {
    id: 'mrna',
    label: 'mRNA',
    color: '#06b6d4',
    title: 'Step 3: mRNA Travels',
    text: 'The mRNA exits the nucleus and carries the genetic message to a ribosome in the cytoplasm.',
  },
  {
    id: 'translation',
    label: 'Translation',
    color: '#84cc16',
    title: 'Step 4: Translation',
    text: 'At the ribosome, mRNA is read in groups of three (codons). Each codon tells the ribosome which amino acid to add next.',
  },
  {
    id: 'protein',
    label: 'Protein!',
    color: '#fbbf24',
    title: 'Step 5: Protein Complete!',
    text: 'Amino acids link together in the correct order, folding into a finished protein — ready to do its job in the cell!',
  },
]

export default function SectionSynthesisSteps() {
  const [stepIndex, setStepIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const step = STEPS[stepIndex]

  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [autoPlay])

  return (
    <div>
      <div className="mb-4">
        <p className="text-lab-lime text-lg font-bold">Section 3</p>
        <h2 className="text-3xl font-black text-white">🧬 Protein Synthesis Steps</h2>
      </div>

      <div className="flex items-center justify-center gap-0 mb-6 overflow-x-auto pb-2 px-1">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => { setStepIndex(i); setAutoPlay(false) }}
              className={`flex-shrink-0 flex flex-col items-center transition-all duration-300 ${
                i === stepIndex ? 'scale-110' : 'opacity-50 hover:opacity-80'
              }`}
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-black text-lg border-2 ${
                  i <= stepIndex ? 'text-indigo-900' : 'text-white/60'
                }`}
                style={{
                  background: i <= stepIndex ? s.color : 'transparent',
                  borderColor: s.color,
                  boxShadow: i === stepIndex ? `0 0 16px ${s.color}` : 'none',
                }}
              >
                {i + 1}
              </div>
              <span
                className="text-base font-bold mt-1 whitespace-nowrap max-w-[72px] text-center leading-tight"
                style={{ color: i === stepIndex ? s.color : 'rgba(255,255,255,0.4)' }}
              >
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className="w-4 sm:w-6 h-0.5 mx-0.5 sm:mx-1 flex-shrink-0 rounded"
                style={{ background: i < stepIndex ? STEPS[i + 1].color : 'rgba(255,255,255,0.15)' }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="hidden sm:flex items-center justify-center gap-1 mb-4 text-white/30 text-base font-bold">
        DNA → Transcription → mRNA → Translation → Protein
      </div>

      <div key={stepIndex}>
        <div
          className="rounded-2xl p-4 border-2 animate-slide-in-right"
          style={{ borderColor: step.color, background: `${step.color}15` }}
        >
          <h3 className="font-black text-xl mb-2" style={{ color: step.color }}>
            {step.title}
          </h3>
          <p className="text-white/85 text-lg leading-relaxed">{step.text}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => { setStepIndex((i) => Math.max(0, i - 1)); setAutoPlay(false) }}
          disabled={stepIndex === 0}
          className="text-lg font-bold text-white/60 hover:text-white disabled:opacity-30"
        >
          ← Prev step
        </button>
        <button
          onClick={() => setAutoPlay((a) => !a)}
          className={`text-base font-bold px-4 py-1.5 rounded-full border ${
            autoPlay ? 'border-lab-lime text-lab-lime bg-lab-lime/10' : 'border-white/20 text-white/50'
          }`}
        >
          {autoPlay ? 'Pause auto-play' : 'Auto-play'}
        </button>
        <button
          onClick={() => { setStepIndex((i) => Math.min(STEPS.length - 1, i + 1)); setAutoPlay(false) }}
          disabled={stepIndex === STEPS.length - 1}
          className="text-lg font-bold text-white/60 hover:text-white disabled:opacity-30"
        >
          Next step →
        </button>
      </div>
    </div>
  )
}
