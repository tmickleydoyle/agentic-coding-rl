'use client'
import { useApp } from '../hooks/useApp'
import { fmt } from '../lib/fmt'

export function Summary() {
  const { invoices } = useApp()
  const total = invoices.length
  const paid = invoices.filter((inv) => inv.paid)
  const unpaid = invoices.filter((inv) => !inv.paid)
  const totalOutstanding = unpaid.reduce((sum, inv) => sum + inv.amount, 0)
  const totalCollected = paid.reduce((sum, inv) => sum + inv.amount, 0)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total invoices: ${total}`}</p>
      <p>{`Paid: ${paid.length}`}</p>
      <p>{`Unpaid: ${unpaid.length}`}</p>
      <p>{`Total outstanding: ${fmt(totalOutstanding)}`}</p>
      <p>{`Total collected: ${fmt(totalCollected)}`}</p>
    </section>
  )
}
