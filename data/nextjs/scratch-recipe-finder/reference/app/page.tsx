'use client'
import { useState } from 'react'

interface Recipe {
  id: number
  name: string
  category: string
  time: number
  ingredients: number
}

const SEED: Recipe[] = [
  { id: 1, name: 'Spaghetti Bolognese', category: 'Dinner', time: 45, ingredients: 8 },
  { id: 2, name: 'Caesar Salad', category: 'Lunch', time: 15, ingredients: 6 },
  { id: 3, name: 'Pancakes', category: 'Breakfast', time: 20, ingredients: 5 },
  { id: 4, name: 'Grilled Chicken', category: 'Dinner', time: 35, ingredients: 7 },
  { id: 5, name: 'Avocado Toast', category: 'Breakfast', time: 10, ingredients: 4 },
  { id: 6, name: 'Tomato Soup', category: 'Lunch', time: 25, ingredients: 6 },
]

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner']

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(SEED.map(r => ({ ...r })))
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState('Breakfast')
  const [newTime, setNewTime] = useState('')
  const [newIngredients, setNewIngredients] = useState('')

  const filtered = recipes.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  function addRecipe() {
    const t = parseInt(newTime, 10)
    const ing = parseInt(newIngredients, 10)
    if (!newName.trim() || !isFinite(t) || t <= 0 || !isFinite(ing) || ing <= 0) return
    setRecipes(prev => [
      ...prev,
      { id: prev.length + 1, name: newName.trim(), category: newCategory, time: t, ingredients: ing },
    ])
    setNewName('')
    setNewCategory('Breakfast')
    setNewTime('')
    setNewIngredients('')
  }

  return (
    <div>
      <h1>Recipe Finder</h1>

      <div>
        <input
          aria-label="Search recipes"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search recipes..."
        />
        <select
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <p data-testid="recipe-count">Showing {filtered.length} recipes</p>

      {filtered.length === 0 ? (
        <p data-testid="no-results">No recipes found</p>
      ) : (
        <ul>
          {filtered.map(r => (
            <li key={r.id} data-testid="recipe-card">
              <strong>{r.name}</strong>
              <span data-testid="recipe-category">{r.category}</span>
              <span data-testid="recipe-time">{r.time} min</span>
              <span data-testid="recipe-ingredients">{r.ingredients} ingredients</span>
            </li>
          ))}
        </ul>
      )}

      <div>
        <h2>Add Recipe</h2>
        <label>
          Recipe Name
          <input
            aria-label="Recipe Name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
        </label>
        <label>
          Category
          <select
            aria-label="Category"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
          >
            {['Breakfast', 'Lunch', 'Dinner'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Cook Time (min)
          <input
            aria-label="Cook Time (min)"
            type="number"
            value={newTime}
            onChange={e => setNewTime(e.target.value)}
          />
        </label>
        <label>
          Ingredients Count
          <input
            aria-label="Ingredients Count"
            type="number"
            value={newIngredients}
            onChange={e => setNewIngredients(e.target.value)}
          />
        </label>
        <button onClick={addRecipe}>Add Recipe</button>
      </div>
    </div>
  )
}
