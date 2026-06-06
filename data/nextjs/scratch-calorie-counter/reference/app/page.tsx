'use client'
import { useState } from 'react'

interface Food {
  id: number
  name: string
  calories: number
}

const FOOD_DB: Food[] = [
  { id: 1, name: 'Apple', calories: 95 },
  { id: 2, name: 'Banana', calories: 105 },
  { id: 3, name: 'Boiled Egg', calories: 78 },
  { id: 4, name: 'Brown Rice (cup)', calories: 216 },
  { id: 5, name: 'Cheddar Cheese', calories: 113 },
  { id: 6, name: 'Greek Yogurt', calories: 100 },
  { id: 7, name: 'Grilled Chicken', calories: 165 },
  { id: 8, name: 'Milk (cup)', calories: 149 },
  { id: 9, name: 'Peanut Butter', calories: 188 },
  { id: 10, name: 'Whole Wheat Bread', calories: 69 },
]

interface ConsumedItem {
  uid: number
  food: Food
}

export default function App() {
  const [goal, setGoal] = useState(2000)
  const [search, setSearch] = useState('')
  const [consumed, setConsumed] = useState<ConsumedItem[]>([])
  const [nextUid, setNextUid] = useState(1)

  const filtered = FOOD_DB.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  function addFood(food: Food) {
    setConsumed(prev => [...prev, { uid: nextUid, food }])
    setNextUid(n => n + 1)
  }

  function removeItem(uid: number) {
    setConsumed(prev => prev.filter(c => c.uid !== uid))
  }

  const consumedTotal = consumed.reduce((sum, c) => sum + c.food.calories, 0)
  const remaining = goal - consumedTotal

  let status = 'Under goal'
  if (consumedTotal === goal) status = 'Goal reached!'
  else if (consumedTotal > goal) status = 'Over goal'

  return (
    <div>
      <h1>Calorie Counter</h1>

      <label htmlFor="goal-input">Daily Goal (cal)</label>
      <input
        id="goal-input"
        type="number"
        value={goal}
        onChange={e => setGoal(parseInt(e.target.value, 10) || 0)}
      />

      <label htmlFor="search-input">Search Food</label>
      <input
        id="search-input"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search food..."
      />

      <ul data-testid="food-list">
        {filtered.map(food => (
          <li key={food.id} data-testid="food-item">
            <span data-testid="food-name">{food.name}</span>
            <span data-testid="food-calories">{food.calories}</span>
            <button onClick={() => addFood(food)}>Add</button>
          </li>
        ))}
      </ul>

      <ul data-testid="consumed-list">
        {consumed.map(c => (
          <li key={c.uid} data-testid="consumed-item">
            <span>{c.food.name}</span>
            <span>{c.food.calories}</span>
            <button onClick={() => removeItem(c.uid)}>Remove</button>
          </li>
        ))}
      </ul>

      <div data-testid="summary">
        <p data-testid="consumed-total">{consumedTotal}</p>
        <p data-testid="remaining">{remaining}</p>
        <p data-testid="status">{status}</p>
      </div>
    </div>
  )
}
