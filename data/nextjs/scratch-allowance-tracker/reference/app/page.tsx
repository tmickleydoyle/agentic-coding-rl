'use client'
import { useState } from 'react'

interface Transaction {
  id: number
  date: string
  description: string
  type: 'earning' | 'spending'
  amount: number
}

type Filter = 'all' | 'earning' | 'spending'

const SEED: Transaction[] = [
  { id: 1, date: '2024-01-07', description: 'Weekly allowance', type: 'earning', amount: 10.00 },
  { id: 2, date: '2024-01-08', description: 'Candy', type: 'spending', amount: 2.50 },
  { id: 3, date: '2024-01-14', description: 'Weekly allowance', type: 'earning', amount: 10.00 },
  { id: 4, date: '2024-01-15', description: 'Comic book', type: 'spending', amount: 4.00 },
  { id: 5, date: '2024-01-21', description: 'Weekly allowance', type: 'earning', amount: 10.00 },
]

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(SEED.map(t => ({ ...t })))
  const [filter, setFilter] = useState<Filter>('all')
  const [dateInput, setDateInput] = useState('')
  const [descInput, setDescInput] = useState('')
  const [typeInput, setTypeInput] = useState<'earning' | 'spending'>('earning')
  const [amountInput, setAmountInput] = useState('')

  function addTransaction() {
    const date = dateInput.trim()
    const description = descInput.trim()
    const amount = parseFloat(amountInput)
    if (!date || !description || isNaN(amount) || amount <= 0) return
    const maxId = transactions.reduce((m, t) => Math.max(m, t.id), 0)
    setTransactions(prev => [...prev, { id: maxId + 1, date, description, type: typeInput, amount }])
    setDateInput('')
    setDescInput('')
    setAmountInput('')
  }

  function deleteTransaction(id: number) {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const totalEarned = transactions.filter(t => t.type === 'earning').reduce((s, t) => s + t.amount, 0)
  const totalSpent = transactions.filter(t => t.type === 'spending').reduce((s, t) => s + t.amount, 0)
  const balance = totalEarned - totalSpent

  // Compute running balances for all transactions (unfiltered)
  const runningBalances: Record<number, number> = {}
  let running = 0
  transactions.forEach(t => {
    running += t.type === 'earning' ? t.amount : -t.amount
    runningBalances[t.id] = running
  })

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter(t => t.type === filter)

  return (
    <div>
      <h1>Allowance Tracker</h1>

      <div>
        <span data-testid="total-earned">Total Earned: ${totalEarned.toFixed(2)}</span>
        <span data-testid="total-spent">Total Spent: ${totalSpent.toFixed(2)}</span>
        <span data-testid="balance">Balance: ${balance.toFixed(2)}</span>
      </div>

      <div>
        <input
          data-testid="date-input"
          type="date"
          value={dateInput}
          onChange={e => setDateInput(e.target.value)}
        />
        <input
          data-testid="desc-input"
          type="text"
          placeholder="Description"
          value={descInput}
          onChange={e => setDescInput(e.target.value)}
        />
        <select
          data-testid="type-select"
          value={typeInput}
          onChange={e => setTypeInput(e.target.value as 'earning' | 'spending')}
        >
          <option value="earning">earning</option>
          <option value="spending">spending</option>
        </select>
        <input
          data-testid="amount-input"
          type="number"
          placeholder="Amount"
          value={amountInput}
          onChange={e => setAmountInput(e.target.value)}
        />
        <button data-testid="add-btn" onClick={addTransaction}>Add Transaction</button>
      </div>

      <div>
        <button
          data-testid="filter-all"
          aria-pressed={filter === 'all'}
          onClick={() => setFilter('all')}
        >All</button>
        <button
          data-testid="filter-earnings"
          aria-pressed={filter === 'earning'}
          onClick={() => setFilter('earning')}
        >Earnings</button>
        <button
          data-testid="filter-spending"
          aria-pressed={filter === 'spending'}
          onClick={() => setFilter('spending')}
        >Spending</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Running Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody data-testid="transaction-table">
          {filtered.map(t => (
            <tr key={t.id} data-testid={`row-${t.id}`}>
              <td>{t.date}</td>
              <td>{t.description}</td>
              <td>{t.type === 'earning' ? 'Earning' : 'Spending'}</td>
              <td>{t.type === 'earning' ? `+$${t.amount.toFixed(2)}` : `-$${t.amount.toFixed(2)}`}</td>
              <td data-testid={`running-balance-${t.id}`}>${runningBalances[t.id].toFixed(2)}</td>
              <td>
                <button data-testid={`delete-btn-${t.id}`} onClick={() => deleteTransaction(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
