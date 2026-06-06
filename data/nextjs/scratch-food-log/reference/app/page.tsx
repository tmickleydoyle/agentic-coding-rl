'use client'
import { useState } from 'react'

interface LogEntry {
  id: number
  name: string
  meal: string
  calories: number
}

const SEED: LogEntry[] = [
  { id: 1, name: 'Oatmeal', meal: 'Breakfast', calories: 300 },
  { id: 2, name: 'Orange Juice', meal: 'Breakfast', calories: 110 },
  { id: 3, name: 'Caesar Salad', meal: 'Lunch', calories: 450 },
  { id: 4, name: 'Chicken Breast', meal: 'Dinner', calories: 280 },
]

const MEAL_OPTIONS = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

export default function App() {
  const [entries, setEntries] = useState<LogEntry[]>(SEED.map(e => ({ ...e })))
  const [foodName, setFoodName] = useState('')
  const [meal, setMeal] = useState('Breakfast')
  const [calories, setCalories] = useState('')
  const [nextId, setNextId] = useState(SEED.length + 1)

  function addEntry() {
    const cal = parseInt(calories, 10)
    if (!foodName.trim() || !meal || !cal || cal <= 0) return
    setEntries(prev => [...prev, { id: nextId, name: foodName.trim(), meal, calories: cal }])
    setNextId(n => n + 1)
    setFoodName('')
    setCalories('')
    setMeal('Breakfast')
  }

  function removeEntry(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0)

  const mealTotals: Record<string, number> = {}
  entries.forEach(e => {
    mealTotals[e.meal] = (mealTotals[e.meal] || 0) + e.calories
  })

  return (
    <div>
      <h1>Food Log</h1>

      <div>
        <label htmlFor="food-name">Food Name</label>
        <input
          id="food-name"
          value={foodName}
          onChange={e => setFoodName(e.target.value)}
        />

        <label htmlFor="meal-select">Meal</label>
        <select
          id="meal-select"
          value={meal}
          onChange={e => setMeal(e.target.value)}
        >
          {MEAL_OPTIONS.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <label htmlFor="calories-input">Calories</label>
        <input
          id="calories-input"
          type="number"
          value={calories}
          onChange={e => setCalories(e.target.value)}
        />

        <button onClick={addEntry}>Add Entry</button>
      </div>

      <ul>
        {entries.map(entry => (
          <li key={entry.id} data-testid="log-entry">
            <span data-testid="entry-name">{entry.name}</span>
            <span data-testid="entry-meal">{entry.meal}</span>
            <span data-testid="entry-calories">{entry.calories}</span>
            <button data-testid="remove-btn" onClick={() => removeEntry(entry.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <div data-testid="summary">
        <p data-testid="entry-count">{entries.length}</p>
        <p data-testid="total-calories">{totalCalories}</p>
        <div data-testid="meal-breakdown">
          {Object.keys(mealTotals).map(m => (
            <p key={m} data-testid="breakdown-item">{m}: {mealTotals[m]} cal</p>
          ))}
        </div>
      </div>
    </div>
  )
}
