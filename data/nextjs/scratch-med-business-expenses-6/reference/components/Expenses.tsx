'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Category } from '../lib/types'

const CATEGORIES: Category[] = ['Meals', 'Travel', 'Software', 'Office', 'Other']

function fmt(n: number) {
  return `$${n.toFixed(2)}`
}

export function Expenses() {
  const { expenses, filter, setFilter, addExpense, deleteExpense } = useApp()
  const [vendor, setVendor] = useState('')
  const [category, setCategory] = useState<Category>('Meals')
  const [amount, setAmount] = useState('')

  function handleAdd() {
    const a = parseFloat(amount)
    addExpense(vendor, category, a)
    setVendor('')
    setAmount('')
  }

  const visible = filter === 'All' ? expenses : expenses.filter((e) => e.category === filter)
  const total = visible.reduce((sum, e) => sum + e.amount, 0)

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
          value={amount}
          type="number"
          min="0"
          step="0.01"
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
        {visible.map((e) => (
          <li key={e.id}>
            <span>{e.vendor}</span>
            <span>{e.category}</span>
            <span>{fmt(e.amount)}</span>
            <button aria-label={`Delete ${e.vendor}`} onClick={() => deleteExpense(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p>{`Total: ${fmt(total)}`}</p>
    </section>
  )
}
