'use client'
import { useGrowth } from '../hooks/useGrowth'

export function Overview() {
  const { blasts } = useGrowth()
  const sent = blasts.reduce((s, b) => s + b.sent, 0)
  const opens = blasts.reduce((s, b) => s + b.opens, 0)
  const clicks = blasts.reduce((s, b) => s + b.clicks, 0)
  const openRate = sent > 0 ? `${Math.round((opens / sent) * 100)}%` : 'n/a'
  const ctr = opens > 0 ? `${Math.round((clicks / opens) * 100)}%` : 'n/a'
  return (
    <section aria-label="Overview view">
      <h1>Overview</h1>
      <p>{`Total sent: ${sent}`}</p>
      <p>{`Total opens: ${opens}`}</p>
      <p>{`Total clicks: ${clicks}`}</p>
      <p>{`Open rate: ${openRate}`}</p>
      <p>{`Click-through rate: ${ctr}`}</p>
    </section>
  )
}
