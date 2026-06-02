'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Category } from '../lib/types'

const CATEGORIES: Category[] = ['Food', 'Travel', 'Software', 'Office', 'Other']

export function Expenses() {
  const { expenses, filter, addExpense, deleteExpense, setFilter } = useApp()
  const [vendor, setVendor] = useState('')
  const [category, setCategory] = useState<Category>('Food')
  const [amount, setAmount] = useState('')

  const visible = filter === 'All' ? expenses : expenses.filter((e) => e.category === filter)
  const visibleTotal = visible.reduce((sum, e) => sum + e.amount, 0)

  function handleAdd() {
    const parsed = parseFloat(amount)
    addExpense(vendor, category, parsed)
    if (vendor.trim() && parsed > 0) {
      setVendor('')
      setAmount('')
    }
  }

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
        {visible.map((e) => (
          <li key={e.id}>
            <span>{e.vendor}</span>
            <span>{e.category}</span>
            <span>{`$${e.amount.toFixed(2)}`}</span>
            <button aria-label={`Delete ${e.vendor}`} onClick={() => deleteExpense(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p>{`Visible Total: $${visibleTotal.toFixed(2)}`}</p>
    </section>
  )
}
