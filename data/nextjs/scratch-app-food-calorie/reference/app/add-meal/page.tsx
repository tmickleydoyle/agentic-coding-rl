'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function AddMealPage() {
  const { addMeal, navigate, today } = useApp()
  const [name, setName] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    const cal = Number(calories)
    if (calories.trim().length === 0 || Number.isNaN(cal) || cal < 0) {
      setError('Calories must be a non-negative number')
      return
    }
    setError('')
    addMeal({
      name: name.trim(),
      date: today,
      calories: cal,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    })
    setName('')
    setCalories('')
    setProtein('')
    setCarbs('')
    setFat('')
    navigate('today')
  }

  return (
    <section data-testid="page-add-meal">
      <h1>Add meal</h1>
      <form data-testid="add-meal-form" onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" data-testid="name-input" value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="calories">Calories</label>
        <input id="calories" data-testid="calories-input" value={calories} onChange={(e) => setCalories(e.target.value)} />

        <label htmlFor="protein">Protein</label>
        <input id="protein" data-testid="protein-input" value={protein} onChange={(e) => setProtein(e.target.value)} />

        <label htmlFor="carbs">Carbs</label>
        <input id="carbs" data-testid="carbs-input" value={carbs} onChange={(e) => setCarbs(e.target.value)} />

        <label htmlFor="fat">Fat</label>
        <input id="fat" data-testid="fat-input" value={fat} onChange={(e) => setFat(e.target.value)} />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-meal">
          Add meal
        </button>
      </form>
    </section>
  )
}
