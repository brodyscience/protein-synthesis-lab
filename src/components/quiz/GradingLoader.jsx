export default function GradingLoader() {
  return (
    <div className="game-card rounded-3xl p-10 text-center animate-pulse-glow">
      <h2 className="text-2xl font-black text-lab-cyan mb-2">AI grading in progress</h2>
      <p className="text-white/70 text-lg">
        Evaluating your Claim, Evidence, and Reasoning using NYS NYSSLS standards…
      </p>
      <div className="flex justify-center gap-2 mt-6">
        {['Claim', 'Evidence', 'Reasoning'].map((label) => (
          <span
            key={label}
            className="px-3 py-1 rounded-full bg-white/10 text-base font-bold text-white/60 animate-bounce-soft"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
