'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function GoalsPage() {
  const { goal, setGoal, theme, setTheme } = useApp()
  const [calories, setCalories] = useState(String(goal.calories))
  const [protein, setProtein] = useState(String(goal.protein))
  const [carbs, setCarbs] = useState(String(goal.carbs))
  const [fat, setFat] = useState(String(goal.fat))
  const [saved, setSaved] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setGoal({
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    })
    setSaved(true)
  }

  return (
    <section data-testid="page-goals">
      <h1>Goals</h1>
      <p data-testid="current-goal-calories">{goal.calories}</p>
      <form data-testid="goals-form" onSubmit={onSubmit}>
        <label htmlFor="goal-calories">Calorie goal</label>
        <input
          id="goal-calories"
          data-testid="goal-calories-input"
          value={calories}
          onChange={(e) => {
            setCalories(e.target.value)
            setSaved(false)
          }}
        />
        <label htmlFor="goal-protein">Protein goal</label>
        <input id="goal-protein" data-testid="goal-protein-input" value={protein} onChange={(e) => setProtein(e.target.value)} />
        <label htmlFor="goal-carbs">Carbs goal</label>
        <input id="goal-carbs" data-testid="goal-carbs-input" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
        <label htmlFor="goal-fat">Fat goal</label>
        <input id="goal-fat" data-testid="goal-fat-input" value={fat} onChange={(e) => setFat(e.target.value)} />
        <button type="submit" data-testid="save-goal">
          Save
        </button>
        {saved ? <p data-testid="saved-msg">Saved</p> : null}
      </form>
      <div data-testid="theme-section">
        <p data-testid="current-theme">{theme}</p>
        <button data-testid="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
      </div>
    </section>
  )
}
