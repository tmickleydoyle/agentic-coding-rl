'use client'
import { useApp } from '../hooks/useApp'
import { formatAmount } from '../lib/utils'

export function Summary() {
  const { invoices } = useApp()
  const total = invoices.length
  const paid = invoices.filter((inv) => inv.paid).length
  const unpaid = total - paid
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalOutstanding = invoices.reduce((sum, inv) => (inv.paid ? sum : sum + inv.amount), 0)
  const paidRate = total === 0 ? 0 : Math.round((paid / total) * 100)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total invoices: ${total}`}</p>
      <p>{`Paid: ${paid}`}</p>
      <p>{`Unpaid: ${unpaid}`}</p>
      <p>{`Total billed: ${formatAmount(totalBilled)}`}</p>
      <p>{`Total outstanding: ${formatAmount(totalOutstanding)}`}</p>
      <p>{`Paid rate: ${paidRate}%`}</p>
    </section>
  )
}
