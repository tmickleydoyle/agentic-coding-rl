'use client'
import { useApp } from '../hooks/useApp'
import { fmt } from '../lib/fmt'

export function Summary() {
  const { invoices } = useApp()
  const total = invoices.length
  const paid = invoices.filter((inv) => inv.paid).length
  const unpaid = invoices.filter((inv) => !inv.paid).length
  const outstanding = invoices.filter((inv) => !inv.paid).reduce((sum, inv) => sum + inv.amount, 0)
  const collected = invoices.filter((inv) => inv.paid).reduce((sum, inv) => sum + inv.amount, 0)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total invoices: ${total}`}</p>
      <p>{`Paid: ${paid}`}</p>
      <p>{`Unpaid: ${unpaid}`}</p>
      <p>{`Total outstanding: ${fmt(outstanding)}`}</p>
      <p>{`Total collected: ${fmt(collected)}`}</p>
    </section>
  )
}
