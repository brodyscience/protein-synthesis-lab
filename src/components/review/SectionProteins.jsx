const FACTS = [
  { title: 'Build & Repair', text: 'Proteins build muscles, skin, hair, and repair damaged cells.' },
  { title: 'Enzymes', text: 'Special proteins called enzymes speed up chemical reactions in your body.' },
  { title: 'Protection', text: 'Antibodies are proteins that help fight off germs and keep you healthy.' },
]

export default function SectionProteins() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-lab-cyan text-lg font-bold">Section 1</p>
        <h2 className="text-3xl font-black text-white">What Is a Protein?</h2>
      </div>

      <div className="space-y-4">
        <p className="text-white/90 text-lg leading-relaxed animate-slide-in-right">
          A <span className="text-lab-yellow font-black">protein</span> is a large molecule made of
          building blocks called <span className="text-lab-pink font-black">amino acids</span>, linked
          together like beads on a necklace. Your body contains thousands of different proteins — each
          with its own special job!
        </p>

        <div className="grid gap-3 sm:grid-cols-3 mt-6">
          {FACTS.map((fact, i) => (
            <div
              key={fact.title}
              className={`rounded-2xl p-4 border-2 animate-pop-in stagger-${i + 1}`}
              style={{
                borderColor: ['#fbbf24', '#ec4899', '#06b6d4'][i],
                background: `linear-gradient(135deg, ${['rgba(251,191,36,0.15)', 'rgba(236,72,153,0.15)', 'rgba(6,182,212,0.15)'][i]} 0%, transparent 100%)`,
              }}
            >
              <h3 className="font-black text-white text-lg">{fact.title}</h3>
              <p className="text-white/70 text-base mt-1 leading-relaxed">{fact.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-lab-lime/10 border border-lab-lime/30 p-4 animate-slide-in-left">
          <p className="text-lg font-bold text-lab-lime">
            Why it matters: Without proteins, living things could not grow, move, or survive. Every
            cell in your body depends on them!
          </p>
        </div>
      </div>
    </div>
  )
}
