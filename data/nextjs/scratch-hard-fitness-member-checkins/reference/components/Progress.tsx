'use client'
import { useGym } from '../hooks/useGym'

export function Progress() {
  const { members, checkins, hideMet } = useGym()

  const rows = members.map((m) => {
    const visits = checkins.filter((c) => c.memberId === m.id).length
    return { ...m, visits, met: visits >= m.goal }
  })
  const visible = rows.filter((r) => !hideMet || !r.met)
  const ranked = [...rows].sort((a, b) => b.visits - a.visits)

  return (
    <section aria-label="Progress view">
      <h1>Progress</h1>
      {visible.map((r) => (
        <div key={r.id}>
          <span>{`${r.name}: ${r.visits}/${r.goal} visits`}</span>
          {r.met && <span>{`${r.name} goal met`}</span>}
        </div>
      ))}
      <h2>Leaderboard</h2>
      <ol>
        {ranked.map((r, i) => (
          <li key={r.id}>{`Rank ${i + 1}: ${r.name} (${r.visits})`}</li>
        ))}
      </ol>
    </section>
  )
}
