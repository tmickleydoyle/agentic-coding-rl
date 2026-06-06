'use client'
import React, { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Ingredient } from '../../lib/types'

export function IngredientsPage() {
  const { ingredients, setIngredients } = useApp()
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')

  const handleAdd = () => {
    if (!name) return
    const newIng: Ingredient = { id: `i${Date.now()}`, name, quantity }
    setIngredients([...ingredients, newIng])
    setName(''); setQuantity('')
  }

  return (
    <div data-testid="ingredients-page">
      <h1>Ingredients</h1>
      <div>
        <input data-testid="input-ingredient-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input data-testid="input-ingredient-quantity" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Quantity" />
        <button data-testid="add-ingredient-btn" onClick={handleAdd}>Add Ingredient</button>
      </div>
      {ingredients.map(i => (
        <div key={i.id} data-testid={`ingredient-item-${i.id}`}>
          <span>{i.name}</span>
          <span>{i.quantity}</span>
        </div>
      ))}
    </div>
  )
}
