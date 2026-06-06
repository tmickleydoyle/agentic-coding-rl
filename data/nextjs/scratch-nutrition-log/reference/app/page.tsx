'use client'
import { useState } from 'react'

type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner'

interface LogEntry {
  id: number
  meal: string
  calories: number
  protein: number
  carbs: number
  fat: number
  mealType: MealType
}

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner']

const CALORIE_GOAL = 2000
const PROTEIN_GOAL = 150
const CARB_GOAL = 250
const FAT_GOAL = 65

const SEED: LogEntry[] = [
  { id: 1, meal: 'Oatmeal with Berries', calories: 320, protein: 10, carbs: 58, fat: 6, mealType: 'breakfast' },
  { id: 2, meal: 'Grilled Chicken Wrap', calories: 480, protein: 38, carbs: 42, fat: 14, mealType: 'lunch' },
  { id: 3, meal: 'Greek Yogurt', calories: 150, protein: 15, carbs: 12, fat: 3, mealType: 'snack' },
  { id: 4, meal: 'Salmon & Veggies', calories: 520, protein: 42, carbs: 28, fat: 22, mealType: 'dinner' },
]

export default function App() {
  const [entries, setEntries] = useState<LogEntry[]>(SEED.map(e => ({ ...e })))
  const [mealName, setMealName] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [mealType, setMealType] = useState<MealType>('breakfast')
  const [filter, setFilter] = useState<'all' | MealType>('all')
  const [nextId, setNextId] = useState(5)

  const handleAdd = () => {
    if (!mealName.trim()) return
    const cal = Number(calories)
    const pro = Number(protein)
    const carb = Number(carbs)
    const ft = Number(fat)
    if (cal < 0 || pro < 0 || carb < 0 || ft < 0) return
    const newEntry: LogEntry = {
      id: nextId,
      meal: mealName.trim(),
      calories: cal,
      protein: pro,
      carbs: carb,
      fat: ft,
      mealType,
    }
    setEntries(prev => [...prev, newEntry])
    setNextId(prev => prev + 1)
    setMealName('')
    setCalories('')
    setProtein('')
    setCarbs('')
    setFat('')
  }

  const handleDelete = (id: number) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const filtered = filter === 'all' ? entries : entries.filter(e => e.mealType === filter)

  const totalCalories = entries.reduce((s, e) => s + e.calories, 0)
  const totalProtein = entries.reduce((s, e) => s + e.protein, 0)
  const totalCarbs = entries.reduce((s, e) => s + e.carbs, 0)
  const totalFat = entries.reduce((s, e) => s + e.fat, 0)

  return (
    <div>
      <h1>Nutrition Log</h1>

      <div>
        <input
          data-testid="meal-name-input"
          value={mealName}
          onChange={e => setMealName(e.target.value)}
          placeholder="Meal Name"
        />
        <input
          type="number"
          data-testid="calories-input"
          value={calories}
          onChange={e => setCalories(e.target.value)}
          placeholder="Calories"
        />
        <input
          type="number"
          data-testid="protein-input"
          value={protein}
          onChange={e => setProtein(e.target.value)}
          placeholder="Protein (g)"
        />
        <input
          type="number"
          data-testid="carbs-input"
          value={carbs}
          onChange={e => setCarbs(e.target.value)}
          placeholder="Carbs (g)"
        />
        <input
          type="number"
          data-testid="fat-input"
          value={fat}
          onChange={e => setFat(e.target.value)}
          placeholder="Fat (g)"
        />
        <select
          data-testid="meal-type-select"
          value={mealType}
          onChange={e => setMealType(e.target.value as MealType)}
        >
          {MEAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button data-testid="log-meal-btn" onClick={handleAdd}>Log Meal</button>
      </div>

      <div>
        <span data-testid="total-calories">{totalCalories}</span>
        <span data-testid="total-protein">{totalProtein}</span>
        <span data-testid="total-carbs">{totalCarbs}</span>
        <span data-testid="total-fat">{totalFat}</span>
      </div>

      <div>
        <span data-testid="calories-progress">{totalCalories} / {CALORIE_GOAL}</span>
        <span data-testid="protein-progress">{totalProtein} / {PROTEIN_GOAL}</span>
        <span data-testid="carbs-progress">{totalCarbs} / {CARB_GOAL}</span>
        <span data-testid="fat-progress">{totalFat} / {FAT_GOAL}</span>
      </div>

      <div>
        <button data-testid="filter-all" onClick={() => setFilter('all')}>All</button>
        {MEAL_TYPES.map(t => (
          <button
            key={t}
            data-testid={`filter-${t}`}
            onClick={() => setFilter(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <ul>
        {filtered.map(entry => (
          <li key={entry.id} data-testid={`entry-card-${entry.id}`}>
            <span data-testid={`entry-meal-${entry.id}`}>{entry.meal}</span>
            <span data-testid={`entry-calories-${entry.id}`}>{entry.calories}</span>
            <span data-testid={`entry-protein-${entry.id}`}>{entry.protein}</span>
            <span data-testid={`entry-carbs-${entry.id}`}>{entry.carbs}</span>
            <span data-testid={`entry-fat-${entry.id}`}>{entry.fat}</span>
            <span data-testid={`entry-type-${entry.id}`}>{entry.mealType}</span>
            <button data-testid={`delete-entry-${entry.id}`} onClick={() => handleDelete(entry.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
