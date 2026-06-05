'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { CATEGORIES } from '../lib/types'
import type { Category } from '../lib/types'
import { formatAmount } from '../lib/utils'

export function Expenses() {
  const { expenses, addExpense, deleteExpense } = useApp()
  const [vendor, setVendor] = useState('')
  const [category, setCategory] = useState<Category>('Food')
  const [amount, setAmount] = useState('')
  const [filter, setFilter] = useState<Category | 'All'>('All')

  function handleAdd() {
    const amt = parseFloat(amount)
    addExpense(vendor, category, amt)
    setVendor('')
    setAmount('')
  }

  const filtered = filter === 'All' ? expenses : expenses.filter((e) => e.category === filter)
  const total = filtered.reduce((sum, e) => sum + e.amount, 0)

  return (
    <section aria-label="Expenses view">
      <h1>Expenses</h1>
      <div>
        <input
          aria-label="Vendor"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
        />
        <select
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          aria-label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleAdd}>Add Expense</button>
      </div>
      <div>
        <select
          aria-label="Filter by category"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Category | 'All')}
        >
          <option value="All">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <ul>
        {filtered.map((e) => (
          <li key={e.id}>
            <span>{e.vendor}</span>
            <span>{e.category}</span>
            <span>{formatAmount(e.amount)}</span>
            <button aria-label={`Delete ${e.vendor}`} onClick={() => deleteExpense(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p>{`Showing: ${filtered.length} expenses`}</p>
      <p>{`Total: ${formatAmount(total)}`}</p>
    </section>
  )
}
