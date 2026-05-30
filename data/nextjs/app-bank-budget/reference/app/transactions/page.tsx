'use client'
import { useState } from 'react'
import { useBudget } from '../../components/BudgetProvider'

export default function TransactionsPage() {
  const { categories, transactions, addTransaction, removeTransaction } = useBudget()
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Number(amount)
    if (amount.trim().length === 0 || Number.isNaN(parsed) || parsed <= 0) {
      setError('Enter a positive amount')
      return
    }
    setError('')
    addTransaction({ categoryId, description: description.trim(), amount: parsed })
    setDescription('')
    setAmount('')
  }

  return (
    <section data-testid="page-transactions">
      <h1>Transactions</h1>
      <form data-testid="txn-form" onSubmit={onSubmit}>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          data-testid="category-select"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label htmlFor="description">Description</label>
        <input
          id="description"
          data-testid="description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          data-testid="amount-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-txn">
          Add transaction
        </button>
      </form>

      {transactions.length === 0 ? (
        <p data-testid="empty-txns">No transactions.</p>
      ) : (
        <ul data-testid="txn-list">
          {transactions.map((t) => (
            <li key={t.id} data-testid={`txn-${t.id}`}>
              <span data-testid={`txn-${t.id}-desc`}>{t.description}</span>
              <span data-testid={`txn-${t.id}-amount`}>{t.amount}</span>
              <button
                data-testid={`txn-${t.id}-remove`}
                onClick={() => removeTransaction(t.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
