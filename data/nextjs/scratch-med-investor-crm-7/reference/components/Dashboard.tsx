'use client'
import { useApp } from '../hooks/useApp'

export function Dashboard() {
  const { investors } = useApp()
  const total = investors.length
  const count = (s: string) => investors.filter((inv) => inv.stage === s).length
  const totalCommitted = investors
    .filter((inv) => inv.stage === 'committed')
    .reduce((sum, inv) => sum + inv.checkSize, 0)
  const pct = total === 0 ? 0 : Math.round((count('committed') / total) * 100)
  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total investors: ${total}`}</p>
      <p>{`Intro: ${count('intro')}`}</p>
      <p>{`Pitched: ${count('pitched')}`}</p>
      <p>{`Committed: ${count('committed')}`}</p>
      <p>{`Total committed: $${totalCommitted}`}</p>
      <p>{`Conversion: ${pct}%`}</p>
    </section>
  )
}
