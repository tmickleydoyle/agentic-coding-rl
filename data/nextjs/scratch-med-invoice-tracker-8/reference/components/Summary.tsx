'use client'
import { useApp } from '../hooks/useApp'
import { fmt } from '../lib/fmt'

export function Summary() {
  const { invoices } = useApp()
  const total = invoices.length
  const paid = invoices.filter((i) => i.status === 'paid').length
  const unpaid = total - paid
  const outstanding = invoices.reduce((sum, i) => (i.status === 'unpaid' ? sum + i.amount : sum), 0)
  const pct = total === 0 ? 0 : Math.round((paid / total) * 100)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total invoices: ${total}`}</p>
      <p>{`Paid: ${paid}`}</p>
      <p>{`Unpaid: ${unpaid}`}</p>
      <p>{`Total outstanding: ${fmt(outstanding)}`}</p>
      <p>{`Paid rate: ${pct}%`}</p>
    </section>
  )
}
