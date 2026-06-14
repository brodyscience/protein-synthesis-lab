import { YouTubeEmbed } from './review/ReviewMedia'
import { REVIEW_VIDEO } from '../data/reviewMedia'

export default function VideoReview({ onBack }) {
  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
          Video Review
        </h1>
        <p className="text-white/60 text-lg font-semibold max-w-xl mx-auto">
          {REVIEW_VIDEO.title}
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="game-card rounded-3xl p-4 sm:p-6 w-full">
          <YouTubeEmbed
            videoId={REVIEW_VIDEO.id}
            title={REVIEW_VIDEO.title}
            large
          />
        </div>
        <p className="text-white/50 text-base text-center mt-4 max-w-lg">
          Watch the full lesson on transcription and translation, then return to the
          written review or start your quiz when you are ready.
        </p>
      </main>

      <footer className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-2xl text-lg font-bold text-white/80 border-2 border-white/20 hover:border-white/40 hover:text-white transition-all"
        >
          ← Back to review
        </button>
      </footer>
    </div>
  )
}
