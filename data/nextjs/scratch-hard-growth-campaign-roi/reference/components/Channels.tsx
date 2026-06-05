'use client'
import { useGrowth } from '../hooks/useGrowth'
import { CHANNELS } from '../lib/types'

export function Channels() {
  const { campaigns } = useGrowth()

  const rows = CHANNELS.map((ch) => {
    const inCh = campaigns.filter((c) => c.channel === ch)
    const spend = inCh.reduce((s, c) => s + c.spend, 0)
    const conversions = inCh.reduce((s, c) => s + c.conversions, 0)
    return { ch, count: inCh.length, spend, conversions }
  }).filter((r) => r.count > 0)

  return (
    <section aria-label="Channels view">
      <h1>Channels</h1>
      {rows.length === 0 && <p>No channel data yet</p>}
      {rows.map((r) => {
        const cpa = r.conversions > 0 ? `$${Math.round(r.spend / r.conversions)}` : 'n/a'
        return (
          <div key={r.ch}>
            <span>{`${r.ch}: $${r.spend} spent, ${r.conversions} conversions, CPA ${cpa}`}</span>
          </div>
        )
      })}
    </section>
  )
}
