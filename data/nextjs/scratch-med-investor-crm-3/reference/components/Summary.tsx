'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { investors } = useApp()
  const total = investors.length
  const countStage = (s: string) => investors.filter((inv) => inv.stage === s).length
  const totalCommitted = investors
    .filter((inv) => inv.stage === 'committed')
    .reduce((sum, inv) => sum + inv.checkSize, 0)
  const avgCheck = total === 0 ? 0 : Math.round(investors.reduce((sum, inv) => sum + inv.checkSize, 0) / total)

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total investors: ${total}`}</p>
      <p>{`Intro: ${countStage('intro')}`}</p>
      <p>{`Pitched: ${countStage('pitched')}`}</p>
      <p>{`Committed: ${countStage('committed')}`}</p>
      <p>{`Total committed: $${totalCommitted}`}</p>
      <p>{`Average check: $${avgCheck}`}</p>
    </section>
  )
}
