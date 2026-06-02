'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { formatAmount } from '../lib/utils'

export function Invoices() {
  const { invoices, addInvoice, markPaid } = useApp()
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(true)

  const displayed = showUnpaidOnly ? invoices.filter((inv) => !inv.paid) : invoices
  const outstanding = invoices.filter((inv) => !inv.paid).reduce((sum, inv) => sum + inv.amount, 0)

  function handleAdd() {
    const parsed = parseFloat(amount)
    addInvoice(client, parsed)
    setClient('')
    setAmount('')
  }

  return (
    <section aria-label="Invoices view">
      <h1>Invoices</h1>
      <input
        aria-label="Client"
        value={client}
        onChange={(e) => setClient(e.target.value)}
      />
      <input
        aria-label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleAdd}>Add invoice</button>
      <label>
        <input
          type="checkbox"
          aria-label="Show unpaid only"
          checked={showUnpaidOnly}
          onChange={(e) => setShowUnpaidOnly(e.target.checked)}
        />
        Show unpaid only
      </label>
      <ul>
        {displayed.map((inv) => (
          <li key={inv.id}>
            <span>{inv.client}</span>
            <span>{formatAmount(inv.amount)}</span>
            <span>{inv.paid ? 'paid' : 'unpaid'}</span>
            {!inv.paid && (
              <button onClick={() => markPaid(inv.id)}>Mark paid</button>
            )}
          </li>
        ))}
      </ul>
      <p>{`Outstanding: ${formatAmount(outstanding)}`}</p>
    </section>
  )
}
