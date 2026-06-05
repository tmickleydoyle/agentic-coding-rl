'use client'
import { useApp } from '../hooks/useApp'

function fmt(n: number) {
  return `$${n.toFixed(2)}`
}

export function Summary() {
  const { invoices } = useApp()
  const total = invoices.length
  const paid = invoices.filter((i) => i.paid).length
  const unpaid = total - paid
  const outstanding = invoices
    .filter((i) => !i.paid)
    .reduce((s, i) => s + i.amount, 0)
  const collected = invoices
    .filter((i) => i.paid)
    .reduce((s, i) => s + i.amount, 0)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total invoices: ${total}`}</p>
      <p>{`Paid: ${paid}`}</p>
      <p>{`Unpaid: ${unpaid}`}</p>
      <p>{`Outstanding: ${fmt(outstanding)}`}</p>
      <p>{`Collected: ${fmt(collected)}`}</p>
    </section>
  )
}
