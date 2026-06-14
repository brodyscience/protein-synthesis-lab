import { useState } from 'react'

export default function StudentNameGate({ onSubmit }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Please enter your name to continue.')
      return
    }
    onSubmit(trimmed)
  }

  return (
    <div className="game-card rounded-3xl p-6 sm:p-8 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-white">Before we start</h2>
        <p className="text-white/70 text-lg mt-2">
          Enter your name so your teacher can track your progress.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="student-name" className="block text-lg font-bold text-lab-cyan mb-2">
          Your name
        </label>
        <input
          id="student-name"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError('') }}
          placeholder="First and last name"
          className="w-full rounded-2xl bg-indigo-950/60 border-2 border-white/15 focus:border-lab-cyan focus:outline-none p-4 text-white text-lg"
          autoFocus
        />
        {error && <p className="text-lab-pink text-base mt-2 font-bold">{error}</p>}

        <button
          type="submit"
          className="btn-game w-full mt-6 px-8 py-3 rounded-2xl font-black text-indigo-900 text-xl"
        >
          Start quiz →
        </button>
      </form>
    </div>
  )
}
