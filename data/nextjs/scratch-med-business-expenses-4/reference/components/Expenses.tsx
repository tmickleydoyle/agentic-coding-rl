'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import type { Category } from '../lib/types'
import { CATEGORIES, fmt } from '../lib/utils'

export function Expenses() {
  const { expenses, filter, addExpense, setFilter } = useApp()
  const [vendor, setVendor] = useState('')
  const [category, setCategory] = useState<Category>('Food')
  const [amount, setAmount] = useState('')

  const visible = filter === 'All' ? expenses : expenses.filter((e) => e.category === filter)
  const showingTotal = visible.reduce((s, e) => s + e.amount, 0)

  function handleAdd() {
    const a = parseFloat(amount)
    addExpense(vendor, category, a)
    setVendor('')
    setAmount('')
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
      {visible.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        <ul>
          {visible.map((e) => (
            <li key={e.id}>
              <span>{e.vendor}</span>
              <span>{e.category}</span>
              <span>{fmt(e.amount)}</span>
            </li>
          ))}
        </ul>
      )}
      <p>{`Showing total: ${fmt(showingTotal)}`}</p>
    </section>
  )
}
