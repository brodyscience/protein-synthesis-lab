import { useState, useEffect, useMemo } from 'react'
import { verifyTeacherPassword } from '../../api/client'
import { getAttempts, computeClassAverages, downloadAttemptsCsv } from '../../utils/attempts'
import { formatDate } from '../../utils/scores'

const TEACHER_AUTH_KEY = 'teacherAuth'

export function getStoredTeacherPassword() {
  return sessionStorage.getItem(TEACHER_AUTH_KEY)
}

export function storeTeacherPassword(password) {
  sessionStorage.setItem(TEACHER_AUTH_KEY, password)
}

export function clearTeacherPassword() {
  sessionStorage.removeItem(TEACHER_AUTH_KEY)
}

function TeacherLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await verifyTeacherPassword(password)
      storeTeacherPassword(password)
      onLogin(password)
    } catch {
      setError('Incorrect password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="game-card rounded-3xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-white">Teacher dashboard</h1>
          <p className="text-white/60 text-lg mt-2">Enter the teacher password to continue.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-2xl bg-indigo-950/60 border-2 border-white/15 focus:border-lab-cyan focus:outline-none p-4 text-white text-lg mb-2"
            autoFocus
          />
          {error && <p className="text-lab-pink font-bold text-base">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-game w-full mt-4 px-8 py-3 rounded-2xl font-black text-indigo-900 text-xl"
          >
            {loading ? 'Checking…' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  )
}

function SortHeader({ label, sortKey, sort, onSort }) {
  const active = sort.key === sortKey
  return (
    <th
      className="px-3 py-3 text-left font-bold text-lab-cyan cursor-pointer hover:text-white whitespace-nowrap"
      onClick={() => onSort(sortKey)}
    >
      {label} {active ? (sort.dir === 'asc' ? '↑' : '↓') : ''}
    </th>
  )
}

function TeacherDashboard({ onBack }) {
  const [attempts, setAttempts] = useState([])
  const [sort, setSort] = useState({ key: 'timestamp', dir: 'desc' })

  const loadData = () => {
    setAttempts(getAttempts())
  }

  useEffect(() => { loadData() }, [])

  const averages = useMemo(() => computeClassAverages(attempts), [attempts])

  const handleSort = (key) => {
    setSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sorted = useMemo(() => {
    return [...attempts].sort((a, b) => {
      const av = a[sort.key] ?? ''
      const bv = b[sort.key] ?? ''
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [attempts, sort])

  const handleLogout = () => {
    clearTeacherPassword()
    onBack()
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Teacher dashboard</h1>
          <p className="text-white/60 text-lg">Protein synthesis — student attempts on this device</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => downloadAttemptsCsv(attempts)}
            disabled={attempts.length === 0}
            className="btn-game px-6 py-2 rounded-xl font-black text-indigo-900 text-lg disabled:opacity-40"
          >
            Download CSV
          </button>
          <button
            onClick={loadData}
            className="px-6 py-2 rounded-xl font-bold text-white border-2 border-white/20 hover:border-white/40"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-xl font-bold text-white/60 border-2 border-white/10 hover:border-white/30"
          >
            Log out
          </button>
        </div>
      </div>

      {averages.count > 0 && (
        <div className="game-card rounded-2xl p-5 mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Students', value: averages.count, fmt: (v) => v },
            { label: 'Avg MC', value: averages.mcScore, fmt: (v) => v.toFixed(1) },
            { label: 'Avg Claim', value: averages.crClaim, fmt: (v) => v.toFixed(1) },
            { label: 'Avg Evidence', value: averages.crEvidence, fmt: (v) => v.toFixed(1) },
            { label: 'Avg Reasoning', value: averages.crReasoning, fmt: (v) => v.toFixed(1) },
            { label: 'Avg Total', value: averages.combinedTotal, fmt: (v) => v.toFixed(1) },
          ].map(({ label, value, fmt }) => (
            <div key={label} className="text-center">
              <p className="text-white/50 text-base font-bold">{label}</p>
              <p className="text-2xl font-black text-lab-yellow">{fmt(value)}</p>
            </div>
          ))}
        </div>
      )}

      {sorted.length === 0 && (
        <div className="game-card rounded-2xl p-8 text-center">
          <p className="text-white/60 text-lg">No student attempts on this device yet.</p>
          <p className="text-white/40 text-base mt-2">
            Attempts are saved in the browser when students complete the quiz on this computer.
          </p>
        </div>
      )}

      {sorted.length > 0 && (
        <div className="game-card rounded-2xl overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-white/10">
                <SortHeader label="Name" sortKey="studentName" sort={sort} onSort={handleSort} />
                <SortHeader label="Date" sortKey="timestamp" sort={sort} onSort={handleSort} />
                <SortHeader label="MC" sortKey="mcScore" sort={sort} onSort={handleSort} />
                <SortHeader label="Claim" sortKey="crClaimTotal" sort={sort} onSort={handleSort} />
                <SortHeader label="Evidence" sortKey="crEvidenceTotal" sort={sort} onSort={handleSort} />
                <SortHeader label="Reasoning" sortKey="crReasoningTotal" sort={sort} onSort={handleSort} />
                <SortHeader label="CR total" sortKey="crTotal" sort={sort} onSort={handleSort} />
                <SortHeader label="Combined" sortKey="combinedTotal" sort={sort} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {sorted.map((a) => (
                <tr key={a.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-3 py-3 font-bold text-white">{a.studentName}</td>
                  <td className="px-3 py-3 text-white/70 whitespace-nowrap">{formatDate(a.timestamp)}</td>
                  <td className="px-3 py-3">{a.mcScore}/{a.mcTotal}</td>
                  <td className="px-3 py-3">{a.crClaimTotal}</td>
                  <td className="px-3 py-3">{a.crEvidenceTotal}</td>
                  <td className="px-3 py-3">{a.crReasoningTotal}</td>
                  <td className="px-3 py-3">{a.crTotal}/{a.crMax}</td>
                  <td className="px-3 py-3 font-bold text-lab-yellow">{a.combinedTotal}/{a.combinedMax}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className="text-lg font-bold text-white/50 hover:text-white"
        >
          ← Back to app
        </button>
      </div>
    </div>
  )
}

export default function TeacherPortal({ onBack }) {
  const [password, setPassword] = useState(getStoredTeacherPassword())

  if (!password) {
    return <TeacherLogin onLogin={setPassword} />
  }

  return <TeacherDashboard onBack={onBack} />
}
