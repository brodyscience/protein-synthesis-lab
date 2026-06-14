export default function ProgressBar({ current, total, labels }) {
  const percent = ((current + 1) / total) * 100

  return (
    <div className="w-full px-4 pt-4 pb-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold text-lab-yellow">
          Level {current + 1} of {total}
        </span>
        <span className="text-lg font-semibold text-white/70">
          {Math.round(percent)}% complete
        </span>
      </div>

      <div className="relative h-5 rounded-full bg-white/10 overflow-hidden border border-white/20">
        <div
          className="absolute inset-y-0 left-0 progress-shimmer rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
        <div className="absolute inset-0 flex">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className="flex-1 border-r border-white/10 last:border-r-0 flex items-center justify-center"
            >
              {i <= current && (
                <span className="w-2 h-2 rounded-full bg-indigo-900" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-2 px-1">
        {labels.map((label, i) => (
          <span
            key={label}
            className={`text-base font-bold transition-colors duration-300 ${
              i <= current ? 'text-lab-yellow' : 'text-white/30'
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
