'use client'
import { useState } from 'react'

type MealType = 'breakfast' | 'lunch' | 'dinner'

interface Meal {
  id: number
  day: string
  meal: string
  type: MealType
  completed: boolean
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TYPES: MealType[] = ['breakfast', 'lunch', 'dinner']

const SEED: Meal[] = [
  { id: 1, day: 'Monday', meal: 'Oatmeal', type: 'breakfast', completed: false },
  { id: 2, day: 'Monday', meal: 'Grilled Chicken Salad', type: 'lunch', completed: false },
  { id: 3, day: 'Tuesday', meal: 'Scrambled Eggs', type: 'breakfast', completed: true },
  { id: 4, day: 'Wednesday', meal: 'Pasta Bolognese', type: 'dinner', completed: false },
  { id: 5, day: 'Friday', meal: 'Avocado Toast', type: 'breakfast', completed: false },
]

export default function App() {
  const [meals, setMeals] = useState<Meal[]>(SEED.map(m => ({ ...m })))
  const [mealName, setMealName] = useState('')
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [selectedType, setSelectedType] = useState<MealType>('breakfast')
  const [filter, setFilter] = useState<'all' | MealType>('all')
  const [nextId, setNextId] = useState(6)

  const handleAdd = () => {
    if (!mealName.trim()) return
    const newMeal: Meal = {
      id: nextId,
      day: selectedDay,
      meal: mealName.trim(),
      type: selectedType,
      completed: false,
    }
    setMeals(prev => [...prev, newMeal])
    setNextId(prev => prev + 1)
    setMealName('')
  }

  const handleDelete = (id: number) => {
    setMeals(prev => prev.filter(m => m.id !== id))
  }

  const handleToggle = (id: number) => {
    setMeals(prev => prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m))
  }

  const filtered = filter === 'all' ? meals : meals.filter(m => m.type === filter)
  const totalCount = meals.length
  const completedCount = meals.filter(m => m.completed).length

  return (
    <div>
      <h1>Weekly Meal Planner</h1>

      <div>
        <input
          data-testid="meal-name-input"
          value={mealName}
          onChange={e => setMealName(e.target.value)}
          placeholder="Meal Name"
        />
        <select
          data-testid="day-select"
          value={selectedDay}
          onChange={e => setSelectedDay(e.target.value)}
        >
          {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          data-testid="type-select"
          value={selectedType}
          onChange={e => setSelectedType(e.target.value as MealType)}
        >
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button data-testid="add-meal-btn" onClick={handleAdd}>Add Meal</button>
      </div>

      <div>
        <span data-testid="total-count">{totalCount}</span>
        <span data-testid="completed-count">{completedCount}</span>
      </div>

      <div>
        <button data-testid="filter-all" onClick={() => setFilter('all')}>All</button>
        <button data-testid="filter-breakfast" onClick={() => setFilter('breakfast')}>Breakfast</button>
        <button data-testid="filter-lunch" onClick={() => setFilter('lunch')}>Lunch</button>
        <button data-testid="filter-dinner" onClick={() => setFilter('dinner')}>Dinner</button>
      </div>

      <ul>
        {filtered.map(m => (
          <li key={m.id} data-testid={`meal-card-${m.id}`}>
            <span
              data-testid={`meal-name-${m.id}`}
              className={m.completed ? 'line-through' : ''}
            >
              {m.meal}
            </span>
            <span data-testid={`meal-day-${m.id}`}>{m.day}</span>
            <span data-testid={`meal-type-${m.id}`}>{m.type}</span>
            <input
              type="checkbox"
              data-testid={`meal-checkbox-${m.id}`}
              checked={m.completed}
              onChange={() => handleToggle(m.id)}
            />
            <button data-testid={`delete-meal-${m.id}`} onClick={() => handleDelete(m.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
