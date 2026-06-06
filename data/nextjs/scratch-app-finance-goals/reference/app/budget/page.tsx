'use client'
import React, { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { BudgetEntry } from '../../lib/types'

export function BudgetPage() {
  const { budgetEntries, setBudgetEntries } = useApp()
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [month, setMonth] = useState('')

  const handleAdd = () => {
    if (!category || !amount || !month) return
    const entry: BudgetEntry = {
      id: `b${Date.now()}`,
      category,
      amount: parseFloat(amount),
      month,
    }
    setBudgetEntries([...budgetEntries, entry])
    setCategory(''); setAmount(''); setMonth('')
  }

  const total = budgetEntries.reduce((s, e) => s + e.amount, 0)

  return (
    <div data-testid="budget-page">
      <h1>Budget</h1>
      <div>
        <input data-testid="input-budget-category" value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />
        <input data-testid="input-budget-amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" type="number" />
        <input data-testid="input-budget-month" value={month} onChange={e => setMonth(e.target.value)} placeholder="Month YYYY-MM" />
        <button data-testid="add-budget-btn" onClick={handleAdd}>Add Entry</button>
      </div>
      <div data-testid="total-budget">{total}</div>
      {budgetEntries.map(e => (
        <div key={e.id} data-testid={`budget-entry-${e.id}`}>
          <span>{e.category}</span>
          <span>{e.amount}</span>
          <span>{e.month}</span>
        </div>
      ))}
    </div>
  )
}
