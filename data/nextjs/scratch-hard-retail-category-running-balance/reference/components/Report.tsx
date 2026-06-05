'use client'
import { useLedger } from '../hooks/useLedger'
import type { Category } from '../lib/types'
import { CATEGORIES } from '../lib/types'

export function Report() {
  const { entries } = useLedger()
  const totalIn = entries.filter((e) => e.type === 'in').reduce((s, e) => s + e.amount, 0)
  const totalOut = entries.filter((e) => e.type === 'out').reduce((s, e) => s + e.amount, 0)

  const netOf = (c: Category) =>
    entries
      .filter((e) => e.category === c)
      .reduce((s, e) => s + (e.type === 'in' ? e.amount : -e.amount), 0)

  let biggest = 'none'
  if (entries.length > 0) {
    let best = -Infinity
    CATEGORIES.forEach((c) => {
      const n = netOf(c)
      if (n > best) {
        best = n
        biggest = c
      }
    })
  }

  return (
    <section aria-label="Report view">
      <h1>Report</h1>
      <p>{`Money in: $${totalIn}`}</p>
      <p>{`Money out: $${totalOut}`}</p>
      <p>{`Balance: $${totalIn - totalOut}`}</p>
      <p>{`Biggest category: ${biggest}`}</p>
    </section>
  )
}
