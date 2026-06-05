'use client'
import { useFinance } from '../hooks/useFinance'
import { BUDGETS } from '../lib/types'

export function Budgets() {
  const { txns } = useFinance()
  const spent = (cat: string) =>
    txns.filter((t) => t.type === 'expense' && t.category === cat).reduce((s, t) => s + t.amount, 0)
  return (
    <section aria-label="Budgets view">
      <h1>Budgets</h1>
      {BUDGETS.map((b) => {
        const s = spent(b.name)
        return (
          <div key={b.name}>
            <span>{`${b.name}: $${s} of $${b.limit}`}</span>
            {s > b.limit && <span>{`${b.name} over budget`}</span>}
          </div>
        )
      })}
    </section>
  )
}
