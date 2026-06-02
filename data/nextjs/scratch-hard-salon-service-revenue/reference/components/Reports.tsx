'use client'
import { useSalon } from '../hooks/useSalon'
import { priceOf } from '../lib/types'
import { topService } from '../lib/derive'

export function Reports() {
  const { sales } = useSalon()
  const total = sales.length
  const revenue = sales.reduce((sum, s) => sum + priceOf(s.service) + s.tip, 0)
  const tips = sales.reduce((sum, s) => sum + s.tip, 0)
  const avg = total === 0 ? 0 : Math.round(revenue / total)
  return (
    <section aria-label="Reports view">
      <h1>Reports</h1>
      <p>{`Total sales: ${total}`}</p>
      <p>{`Total revenue: $${revenue}`}</p>
      <p>{`Total tips: $${tips}`}</p>
      <p>{`Average sale: $${avg}`}</p>
      <p>{`Top service: ${topService(sales)}`}</p>
    </section>
  )
}
