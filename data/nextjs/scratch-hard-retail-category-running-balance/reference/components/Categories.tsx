'use client'
import { useLedger } from '../hooks/useLedger'
import type { Category } from '../lib/types'
import { CATEGORIES } from '../lib/types'

export function Categories() {
  const { entries } = useLedger()
  const inOf = (c: Category) =>
    entries.filter((e) => e.category === c && e.type === 'in').reduce((s, e) => s + e.amount, 0)
  const outOf = (c: Category) =>
    entries.filter((e) => e.category === c && e.type === 'out').reduce((s, e) => s + e.amount, 0)
  return (
    <section aria-label="Categories view">
      <h1>Categories</h1>
      <ul>
        {CATEGORIES.map((c) => {
          const i = inOf(c)
          const o = outOf(c)
          return <li key={c}>{`${c}: in $${i}, out $${o}, net $${i - o}`}</li>
        })}
      </ul>
    </section>
  )
}
