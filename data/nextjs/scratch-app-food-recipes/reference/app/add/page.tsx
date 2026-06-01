'use client'
import { useState } from 'react'
import { useRecipes } from '../../components/AppStateProvider'

function splitLines(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

export default function AddRecipePage() {
  const { addRecipe, navigate } = useRecipes()
  const [title, setTitle] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [minutes, setMinutes] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Title is required')
      return
    }
    setError('')
    addRecipe({
      title: title.trim(),
      cuisine: cuisine.trim().length > 0 ? cuisine.trim() : 'Other',
      minutes: Number(minutes) || 0,
      ingredients: splitLines(ingredients),
      steps: splitLines(steps),
    })
    setTitle('')
    setCuisine('')
    setMinutes('')
    setIngredients('')
    setSteps('')
    navigate('recipes')
  }

  return (
    <section data-testid="page-add">
      <h1>Add recipe</h1>
      <form data-testid="add-recipe-form" onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          data-testid="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="cuisine">Cuisine</label>
        <input
          id="cuisine"
          data-testid="cuisine-input"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
        />

        <label htmlFor="minutes">Minutes</label>
        <input
          id="minutes"
          type="number"
          data-testid="minutes-input"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />

        <label htmlFor="ingredients">Ingredients</label>
        <textarea
          id="ingredients"
          data-testid="ingredients-input"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />

        <label htmlFor="steps">Steps</label>
        <textarea
          id="steps"
          data-testid="steps-input"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}

        <button type="submit" data-testid="submit-recipe">
          Add recipe
        </button>
      </form>
    </section>
  )
}
