'use client'
import { useFunnel } from '../hooks/useFunnel'
import { pct } from '../lib/types'

export function Analysis() {
  const { funnels, steps, hideEmpty } = useFunnel()
  const shown = funnels.filter((f) => {
    if (!hideEmpty) return true
    return steps.some((s) => s.funnelId === f.id)
  })

  return (
    <section aria-label="Analysis view">
      <h1>Analysis</h1>
      {shown.map((f) => {
        const fs = steps.filter((s) => s.funnelId === f.id)
        const first = fs.length > 0 ? fs[0].users : 0
        const last = fs.length > 0 ? fs[fs.length - 1].users : 0
        const overall = fs.length > 0 ? pct(last, first) : 0
        return (
          <div key={f.id} role="group" aria-label={`${f.name} analysis`}>
            <h2>{f.name}</h2>
            {fs.map((s, i) => {
              const prev = i === 0 ? s.users : fs[i - 1].users
              const dropoff = i === 0 || prev <= 0 ? 0 : 100 - pct(s.users, prev)
              return (
                <p key={s.id}>{`${s.name}: ${s.users} users, ${dropoff}% drop-off`}</p>
              )
            })}
            <p>{`${f.name} overall conversion: ${overall}%`}</p>
          </div>
        )
      })}
    </section>
  )
}
