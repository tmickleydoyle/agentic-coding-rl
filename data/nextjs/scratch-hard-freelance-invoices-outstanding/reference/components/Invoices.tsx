'use client'
import { useState } from 'react'
import { useStudio } from '../hooks/useStudio'

export function Invoices() {
  const { invoices, clients, addInvoice, markPaid } = useStudio()
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [daysOld, setDaysOld] = useState('')
  const [client, setClient] = useState(clients[0])

  return (
    <section aria-label="Invoices view">
      <h1>Invoices</h1>
      <input aria-label="Invoice label" value={label} onChange={(e) => setLabel(e.target.value)} />
      <input aria-label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <input aria-label="Days old" type="number" value={daysOld} onChange={(e) => setDaysOld(e.target.value)} />
      <select aria-label="Client" value={client} onChange={(e) => setClient(e.target.value)}>
        {clients.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          addInvoice(label, client, amount, daysOld)
          setLabel('')
          setAmount('')
          setDaysOld('')
        }}
      >
        Log invoice
      </button>
      <ul>
        {invoices.map((iv) => (
          <li key={iv.id}>
            <span>{`${iv.label} — $${iv.amount} — ${iv.client} — ${iv.paid ? 'PAID' : 'UNPAID'}`}</span>
            {!iv.paid && (
              <button aria-label={`Mark ${iv.label} paid`} onClick={() => markPaid(iv.id)}>
                Mark paid
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
