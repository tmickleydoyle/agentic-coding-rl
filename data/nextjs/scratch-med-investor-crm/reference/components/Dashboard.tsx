'use client'
import { useApp } from '../hooks/useApp'
import { formatDollars } from '../lib/format'

export function Dashboard() {
  const { investors } = useApp()
  const total = investors.length
  const countStage = (s: string) => investors.filter((inv) => inv.stage === s).length
  const totalCommitted = investors
    .filter((inv) => inv.stage === 'committed')
    .reduce((sum, inv) => sum + inv.checkSize, 0)
  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total investors: ${total}`}</p>
      <p>{`Intro: ${countStage('intro')}`}</p>
      <p>{`Pitched: ${countStage('pitched')}`}</p>
      <p>{`Committed: ${countStage('committed')}`}</p>
      <p>{`Total committed: ${totalCommitted === 0 ? '$0' : formatDollars(totalCommitted)}`}</p>
    </section>
  )
}
