'use client'
import { useState } from 'react'
import { useInvoices } from '../../components/AppStateProvider'

export default function NewInvoicePage() {
  const { clients, addInvoice, navigate } = useInvoices()
  const [clientId, setClientId] = useState(clients[0]?.id ?? '')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0) {
      setError('Amount must be greater than zero')
      return
    }
    setError('')
    addInvoice({ clientId, amount: value, dueDate, status: 'draft' })
    setAmount('')
    setDueDate('')
    navigate('invoices')
  }

  return (
    <section data-testid="page-new-invoice">
      <h1>New invoice</h1>
      <form data-testid="new-invoice-form" onSubmit={onSubmit}>
        <label htmlFor="client">Client</label>
        <select
          id="client"
          data-testid="client-select"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        >
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          data-testid="amount-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label htmlFor="due">Due date</label>
        <input
          id="due"
          type="date"
          data-testid="due-input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-invoice">
          Add invoice
        </button>
      </form>
    </section>
  )
}
