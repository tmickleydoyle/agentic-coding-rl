'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { investors } = useApp()
  const total = investors.length
  const intro = investors.filter((i) => i.stage === 'intro').length
  const pitched = investors.filter((i) => i.stage === 'pitched').length
  const committed = investors.filter((i) => i.stage === 'committed').length
  const totalCommitted = investors
    .filter((i) => i.stage === 'committed')
    .reduce((sum, i) => sum + i.checkSize, 0)
  const conversion = total === 0 ? 0 : Math.round((committed / total) * 100)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total investors: ${total}`}</p>
      <p>{`Intro: ${intro}`}</p>
      <p>{`Pitched: ${pitched}`}</p>
      <p>{`Committed: ${committed}`}</p>
      <p>{`Total committed: $${totalCommitted}`}</p>
      <p>{`Conversion: ${conversion}%`}</p>
    </section>
  )
}
