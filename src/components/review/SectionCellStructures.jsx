import { useState } from 'react'

const STRUCTURES = [
  {
    id: 'dna',
    name: 'DNA',
    color: '#a78bfa',
    description: 'The instruction manual! DNA holds the genetic code that tells cells which proteins to make.',
    detail: 'Double helix shape, found inside the nucleus',
  },
  {
    id: 'nucleus',
    name: 'Nucleus',
    color: '#ec4899',
    description: 'The control center of the cell. Transcription happens here — DNA is copied into mRNA.',
    detail: 'Protected by a nuclear membrane',
  },
  {
    id: 'rna',
    name: 'RNA (mRNA)',
    color: '#06b6d4',
    description: 'A messenger molecule that carries DNA instructions from the nucleus to the ribosome.',
    detail: 'Single-stranded copy of a gene',
  },
  {
    id: 'ribosome',
    name: 'Ribosome',
    color: '#84cc16',
    description: 'The protein factory! Ribosomes read mRNA and assemble amino acids into proteins.',
    detail: 'Found floating in cytoplasm or on ER',
  },
]

export default function SectionCellStructures() {
  const [active, setActive] = useState('dna')
  const selected = STRUCTURES.find((s) => s.id === active)

  return (
    <div>
      <div className="mb-4">
        <p className="text-lab-pink text-lg font-bold">Section 2</p>
        <h2 className="text-3xl font-black text-white">🔬 Cell Structures</h2>
      </div>

      <p className="text-white/60 text-base mb-4">
        Click each structure below to learn more.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {STRUCTURES.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`rounded-xl p-3 text-left transition-all duration-300 border-2 ${
              active === s.id
                ? 'scale-105 shadow-lg'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              borderColor: active === s.id ? s.color : 'rgba(255,255,255,0.15)',
              background: active === s.id ? `${s.color}22` : 'rgba(255,255,255,0.05)',
              boxShadow: active === s.id ? `0 0 20px ${s.color}44` : 'none',
            }}
          >
            <p className="font-black text-lg" style={{ color: s.color }}>
              {s.name}
            </p>
          </button>
        ))}
      </div>

      {selected && (
        <div
          key={selected.id}
          className="mt-4 rounded-2xl p-4 animate-slide-in-right border-2"
          style={{ borderColor: selected.color, background: `${selected.color}15` }}
        >
          <p className="text-white/90 text-lg leading-relaxed">{selected.description}</p>
          <p className="text-base font-bold mt-2" style={{ color: selected.color }}>
            {selected.detail}
          </p>
        </div>
      )}
    </div>
  )
}
