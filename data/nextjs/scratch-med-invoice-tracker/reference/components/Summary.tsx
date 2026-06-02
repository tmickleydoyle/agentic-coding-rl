'use client'
import { useApp } from '../hooks/useApp'
import { fmt } from '../lib/fmt'

export function Summary() {
  const { invoices } = useApp()
  const total = invoices.length
  const paid = invoices.filter((i) => i.paid).length
  const unpaid = invoices.filter((i) => !i.paid).length
  const outstanding = invoices.filter((i) => !i.paid).reduce((s, i) => s + i.amount, 0)
  const totalPaid = invoices.filter((i) => i.paid).reduce((s, i) => s + i.amount, 0)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total invoices: ${total}`}</p>
      <p>{`Paid: ${paid}`}</p>
      <p>{`Unpaid: ${unpaid}`}</p>
      <p>{`Total outstanding: ${fmt(outstanding)}`}</p>
      <p>{`Total paid: ${fmt(totalPaid)}`}</p>
    </section>
  )
}
