'use client'
import { useState } from 'react'

interface Category {
  id: number
  name: string
  budget: number
  spent: number
}

const SEED: Category[] = [
  { id: 1, name: 'Housing', budget: 1500, spent: 1450 },
  { id: 2, name: 'Food', budget: 600, spent: 720 },
  { id: 3, name: 'Transport', budget: 300, spent: 280 },
  { id: 4, name: 'Entertainment', budget: 200, spent: 350 },
]

let nextId = 5

function fmtVariance(v: number): string {
  return (v < 0 ? '-' : '') + '$' + Math.abs(v).toFixed(2)
}

function fmt(n: number): string {
  return '$' + n.toFixed(2)
}

export default function App() {
  const [categories, setCategories] = useState<Category[]>(SEED.map(x => ({ ...x })))
  const [nameInput, setNameInput] = useState('')
  const [budgetInput, setBudgetInput] = useState('')
  const [spentInput, setSpentInput] = useState('')

  const totalBudget = categories.reduce((s, c) => s + c.budget, 0)
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0)
  const totalVariance = totalBudget - totalSpent

  function addCategory() {
    if (!nameInput.trim()) return
    const budget = parseFloat(budgetInput) || 0
    const spent = parseFloat(spentInput) || 0
    setCategories(xs => [...xs, { id: nextId++, name: nameInput.trim(), budget, spent }])
    setNameInput('')
    setBudgetInput('')
    setSpentInput('')
  }

  function deleteCategory(id: number) {
    setCategories(xs => xs.filter(x => x.id !== id))
  }

  return (
    <div>
      <h1>Budget Categories</h1>

      <div>
        <input
          aria-label="Category Name"
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          placeholder="Category Name"
        />
        <input
          aria-label="Budget Amount"
          type="number"
          value={budgetInput}
          onChange={e => setBudgetInput(e.target.value)}
          placeholder="Budget"
        />
        <input
          aria-label="Spent Amount"
          type="number"
          value={spentInput}
          onChange={e => setSpentInput(e.target.value)}
          placeholder="Spent"
        />
        <button onClick={addCategory} disabled={!nameInput.trim()}>
          Add Category
        </button>
      </div>

      <ul>
        {categories.map(cat => {
          const variance = cat.budget - cat.spent
          const isOver = variance < 0
          return (
            <li key={cat.id} data-testid="category-row">
              <span>{cat.name}</span>
              <span>Budget: {fmt(cat.budget)}</span>
              <span>Spent: {fmt(cat.spent)}</span>
              <span data-testid="variance">{fmtVariance(variance)}</span>
              <span data-testid="status">{isOver ? 'Over Budget' : 'Under Budget'}</span>
              <button onClick={() => deleteCategory(cat.id)}>Delete</button>
            </li>
          )
        })}
      </ul>

      <div>
        <p data-testid="total-budget">Total Budget: {fmt(totalBudget)}</p>
        <p data-testid="total-spent">Total Spent: {fmt(totalSpent)}</p>
        <p data-testid="total-variance">Total Variance: {fmtVariance(totalVariance)}</p>
        <p data-testid="overall-status">{totalVariance >= 0 ? 'Under Budget' : 'Over Budget'}</p>
      </div>
    </div>
  )
}
