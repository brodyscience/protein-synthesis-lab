import { useState } from 'react'
import ProgressBar from './ProgressBar'
import SectionProteins from './review/SectionProteins'
import SectionCellStructures from './review/SectionCellStructures'
import SectionSynthesisSteps from './review/SectionSynthesisSteps'

const SECTIONS = [
  { id: 'proteins', label: 'Proteins', component: SectionProteins },
  { id: 'structures', label: 'Cell Parts', component: SectionCellStructures },
  { id: 'process', label: 'The Process', component: SectionSynthesisSteps },
]

export default function ReviewWalkthrough({ onComplete, onWatchVideo }) {
  const [currentSection, setCurrentSection] = useState(0)
  const isLastSection = currentSection === SECTIONS.length - 1
  const ActiveSection = SECTIONS[currentSection].component

  const handleNext = () => {
    if (isLastSection) {
      onComplete()
    } else {
      setCurrentSection((s) => s + 1)
    }
  }

  const handlePrev = () => {
    if (currentSection > 0) setCurrentSection((s) => s - 1)
  }

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto">
      <header className="pt-6 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-lab-pink/20 border border-lab-pink/40 rounded-full px-5 py-1.5 mb-3">
          <span className="text-lg font-bold text-lab-pink">
            🧬 Protein Synthesis Lab
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
          Mission Briefing
        </h1>
        <p className="text-white/60 text-lg font-semibold">
          Learn the basics before your quiz challenge!
        </p>
        <button
          onClick={onWatchVideo}
          className="mt-4 px-6 py-2.5 rounded-2xl text-lg font-bold text-lab-cyan border-2 border-lab-cyan/40 bg-lab-cyan/10 hover:bg-lab-cyan/20 hover:border-lab-cyan/60 transition-all"
        >
          Watch Video Review
        </button>
      </header>

      <ProgressBar
        current={currentSection}
        total={SECTIONS.length}
        labels={SECTIONS.map((s) => s.label)}
      />

      <main className="flex-1 px-4 py-6">
        <div key={currentSection} className="game-card rounded-3xl p-6 sm:p-8 min-h-[420px]">
          <ActiveSection />
        </div>
      </main>

      <footer className="px-4 pb-8 flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentSection === 0}
          className="px-6 py-3 rounded-2xl text-lg font-bold text-white/80 border-2 border-white/20 hover:border-white/40 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Back
        </button>

        <div className="flex gap-2">
          {SECTIONS.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentSection
                  ? 'bg-lab-yellow scale-125 shadow-[0_0_12px_#fbbf24]'
                  : i < currentSection
                    ? 'bg-lab-lime'
                    : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <button onClick={handleNext} className="btn-game px-8 py-3 rounded-2xl font-black text-indigo-900 text-xl">
          {isLastSection ? 'Start Quiz →' : 'Next →'}
        </button>
      </footer>
    </div>
  )
}
