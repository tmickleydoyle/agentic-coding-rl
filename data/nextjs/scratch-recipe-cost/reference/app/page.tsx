'use client'
import { useState } from 'react'

interface Ingredient {
  id: number
  name: string
  amount: number
  unit: string
  pricePerUnit: number
}

const SEED_INGREDIENTS: Ingredient[] = [
  { id: 1, name: 'Spaghetti', amount: 400, unit: 'g', pricePerUnit: 0.005 },
  { id: 2, name: 'Eggs', amount: 4, unit: 'pcs', pricePerUnit: 0.30 },
  { id: 3, name: 'Pancetta', amount: 150, unit: 'g', pricePerUnit: 0.04 },
  { id: 4, name: 'Parmesan', amount: 100, unit: 'g', pricePerUnit: 0.06 },
  { id: 5, name: 'Black Pepper', amount: 5, unit: 'g', pricePerUnit: 0.02 },
]

export default function App() {
  const [recipeName, setRecipeName] = useState('Spaghetti Carbonara')
  const [servings, setServings] = useState(4)
  const [ingredients, setIngredients] = useState<Ingredient[]>(SEED_INGREDIENTS.map(i => ({ ...i })))
  const [ingName, setIngName] = useState('')
  const [ingAmount, setIngAmount] = useState('')
  const [ingUnit, setIngUnit] = useState('')
  const [ingPrice, setIngPrice] = useState('')
  const [nextId, setNextId] = useState(6)

  const handleServingsChange = (val: string) => {
    const n = Number(val)
    setServings(n >= 1 ? n : 1)
  }

  const handleAdd = () => {
    if (!ingName.trim()) return
    const amount = Number(ingAmount)
    if (amount <= 0) return
    const price = Number(ingPrice)
    if (price < 0) return
    const newIng: Ingredient = {
      id: nextId,
      name: ingName.trim(),
      amount,
      unit: ingUnit.trim() || 'g',
      pricePerUnit: price,
    }
    setIngredients(prev => [...prev, newIng])
    setNextId(prev => prev + 1)
    setIngName('')
    setIngAmount('')
    setIngUnit('')
    setIngPrice('')
  }

  const handleDelete = (id: number) => {
    setIngredients(prev => prev.filter(i => i.id !== id))
  }

  const totalCost = ingredients.reduce((sum, i) => sum + i.amount * i.pricePerUnit, 0)
  const effectiveServings = Math.max(servings, 1)
  const costPerServing = totalCost / effectiveServings

  return (
    <div>
      <h1>Recipe Cost Calculator</h1>

      <div>
        <input
          data-testid="recipe-name-input"
          value={recipeName}
          onChange={e => setRecipeName(e.target.value)}
          placeholder="Recipe Name"
        />
        <input
          type="number"
          data-testid="servings-input"
          value={servings}
          onChange={e => handleServingsChange(e.target.value)}
          placeholder="Servings"
        />
      </div>

      <div>
        <span data-testid="total-cost">{totalCost.toFixed(2)}</span>
        <span data-testid="cost-per-serving">{costPerServing.toFixed(2)}</span>
        <span data-testid="ingredient-count">{ingredients.length}</span>
      </div>

      <div>
        <input
          data-testid="ingredient-name-input"
          value={ingName}
          onChange={e => setIngName(e.target.value)}
          placeholder="Ingredient Name"
        />
        <input
          type="number"
          data-testid="amount-input"
          value={ingAmount}
          onChange={e => setIngAmount(e.target.value)}
          placeholder="Amount"
        />
        <input
          data-testid="unit-input"
          value={ingUnit}
          onChange={e => setIngUnit(e.target.value)}
          placeholder="Unit"
        />
        <input
          type="number"
          data-testid="price-per-unit-input"
          value={ingPrice}
          onChange={e => setIngPrice(e.target.value)}
          placeholder="Price per Unit"
        />
        <button data-testid="add-ingredient-btn" onClick={handleAdd}>Add Ingredient</button>
      </div>

      <ul>
        {ingredients.map(ing => {
          const lineCost = ing.amount * ing.pricePerUnit
          return (
            <li key={ing.id} data-testid={`ingredient-row-${ing.id}`}>
              <span data-testid={`ingredient-name-${ing.id}`}>{ing.name}</span>
              <span data-testid={`ingredient-amount-${ing.id}`}>{ing.amount} {ing.unit}</span>
              <span data-testid={`ingredient-cost-${ing.id}`}>{lineCost.toFixed(2)}</span>
              <button data-testid={`delete-ingredient-${ing.id}`} onClick={() => handleDelete(ing.id)}>
                Delete
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
