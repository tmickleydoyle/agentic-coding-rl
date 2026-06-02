'use client'
import { usePlatform } from '../hooks/usePlatform'
import { slaState, ratio } from '../lib/sla'

export function Sla() {
  const { incidents } = usePlatform()
  const active = incidents.filter((i) => i.active)
  const breached = active.filter((i) => slaState(i) === 'breached').length
  const atRisk = active.filter((i) => slaState(i) === 'at risk').length
  const resolved = incidents.filter((i) => !i.active).length

  let worst = 'none'
  let bestRatio = -1
  for (let k = 0; k < active.length; k++) {
    const r = ratio(active[k])
    if (r > bestRatio) {
      bestRatio = r
      worst = active[k].title
    }
  }

  return (
    <section aria-label="SLA view">
      <h1>SLA</h1>
      <p>{`Breached: ${breached}`}</p>
      <p>{`At risk: ${atRisk}`}</p>
      <p>{`Resolved: ${resolved}`}</p>
      <p>{`Worst incident: ${worst}`}</p>
    </section>
  )
}
