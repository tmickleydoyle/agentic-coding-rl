'use client'
import { useExperiments } from '../hooks/useExperiments'
import { rate } from '../lib/types'
import type { Variant } from '../lib/types'

function winner(vs: Variant[]): Variant | null {
  let best: Variant | null = null
  let bestRate = -1
  vs.forEach((v) => {
    const r = rate(v.visitors, v.conversions)
    if (r > bestRate) {
      bestRate = r
      best = v
    }
  })
  return best
}

export function Results() {
  const { experiments, variants, hideEmpty } = useExperiments()
  const shown = experiments.filter((exp) => {
    if (!hideEmpty) return true
    return variants.some((v) => v.experimentId === exp.id)
  })

  const totalVisitors = variants.reduce((s, v) => s + v.visitors, 0)
  const totalConversions = variants.reduce((s, v) => s + v.conversions, 0)
  const blended = rate(totalVisitors, totalConversions)

  return (
    <section aria-label="Results view">
      <h1>Results</h1>
      <p>{`Total visitors: ${totalVisitors}`}</p>
      <p>{`Total conversions: ${totalConversions}`}</p>
      <p>{`Overall conversion rate: ${blended}%`}</p>
      {shown.map((exp) => {
        const vs = variants.filter((v) => v.experimentId === exp.id)
        const w = winner(vs)
        return (
          <div key={exp.id}>
            {w ? (
              <p>{`${exp.name} winner: ${w.name} (${rate(w.visitors, w.conversions)}%)`}</p>
            ) : (
              <p>{`${exp.name} winner: none`}</p>
            )}
          </div>
        )
      })}
    </section>
  )
}
