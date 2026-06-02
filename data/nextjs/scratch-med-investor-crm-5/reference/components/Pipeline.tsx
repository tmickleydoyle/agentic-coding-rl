'use client'
import { useApp } from '../hooks/useApp'

export function Pipeline() {
  const { investors } = useApp()
  const total = investors.length
  const count = (stage: string) => investors.filter((inv) => inv.stage === stage).length
  const totalCommitted = investors
    .filter((inv) => inv.stage === 'committed')
    .reduce((sum, inv) => sum + inv.checkSize, 0)
  return (
    <section aria-label="Pipeline view">
      <h1>Pipeline</h1>
      <p>{`Total investors: ${total}`}</p>
      <p>{`Intro: ${count('intro')}`}</p>
      <p>{`Pitched: ${count('pitched')}`}</p>
      <p>{`Committed: ${count('committed')}`}</p>
      <p>{`Total committed: $${totalCommitted}`}</p>
    </section>
  )
}
