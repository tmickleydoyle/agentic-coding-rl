'use client'
import { useApp } from '../hooks/useApp'
import { formatAmount } from '../lib/utils'

export function Summary() {
  const { invoices } = useApp()
  const total = invoices.length
  const paid = invoices.filter((inv) => inv.status === 'paid').length
  const unpaid = invoices.filter((inv) => inv.status === 'unpaid').length
  const outstanding = invoices
    .filter((inv) => inv.status === 'unpaid')
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
