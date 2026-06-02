'use client'
import { useGrowth } from '../hooks/useGrowth'
import { VALUE_PER_CONVERSION } from '../lib/types'

export function Overview() {
  const { campaigns } = useGrowth()
  const spend = campaigns.reduce((s, c) => s + c.spend, 0)
  const conversions = campaigns.reduce((s, c) => s + c.conversions, 0)
  const revenue = conversions * VALUE_PER_CONVERSION
  const cac = conversions > 0 ? `$${Math.round(spend / conversions)}` : 'n/a'
  const roas = spend > 0 ? `${(revenue / spend).toFixed(1)}x` : 'n/a'
  return (
    <section aria-label="Overview view">
      <h1>Overview</h1>
      <p>{`Total spend: $${spend}`}</p>
      <p>{`Total conversions: ${conversions}`}</p>
      <p>{`Total revenue: $${revenue}`}</p>
      <p>{`Blended CAC: ${cac}`}</p>
      <p>{`ROAS: ${roas}`}</p>
    </section>
  )
}
