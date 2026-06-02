'use client'
import { useApp } from '../hooks/useApp'
import { formatAmount } from '../lib/format'

export function Summary() {
  const { invoices } = useApp()
  const total = invoices.length
  const paid = invoices.filter((inv) => inv.paid).length
  const unpaid = total - paid
  const outstanding = invoices
    .filter((inv) => !inv.paid)
    .reduce((sum, inv) => sum + inv.amount, 0)
  const rate = total === 0 ? 0 : Math.round((paid / total) * 100)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total invoices: ${total}`}</p>
      <p>{`Paid: ${paid}`}</p>
      <p>{`Unpaid: ${unpaid}`}</p>
      <p>{`Total outstanding: ${formatAmount(outstanding)}`}</p>
      <p>{`Collection rate: ${rate}%`}</p>
    </section>
  )
}
