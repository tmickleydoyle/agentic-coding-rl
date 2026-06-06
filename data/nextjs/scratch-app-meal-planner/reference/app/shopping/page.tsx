'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function ShoppingPage() {
  const { plan, recipes, shoppingItems, addCustomShoppingItem, toggleShoppingItem } = useApp();
  const [customItem, setCustomItem] = useState('');

  const planIngredients: string[] = [];
  plan.forEach(p => {
    const recipe = recipes.find(r => r.id === p.recipeId);
    if (recipe) {
      recipe.ingredients.forEach(ing => {
        if (!planIngredients.includes(ing)) planIngredients.push(ing);
      });
    }
  });

  return (
    <main data-testid="shopping-page">
      <h2>Shopping List</h2>
      {plan.length === 0 && planIngredients.length === 0
        ? <p data-testid="no-ingredients-msg">No ingredients — plan some meals first</p>
        : null
      }
      <ul data-testid="auto-ingredients-list">
        {planIngredients.map((ing, i) => (
          <li key={i} data-testid={`auto-ingredient-${i}`}>{ing}</li>
        ))}
      </ul>
      <div data-testid="add-custom-form">
        <input data-testid="custom-item-input" value={customItem} onChange={e => setCustomItem(e.target.value)} placeholder="Add custom item" />
        <button data-testid="add-custom-btn" onClick={() => { addCustomShoppingItem(customItem); setCustomItem(''); }}>Add</button>
      </div>
      <ul data-testid="custom-items-list">
        {shoppingItems.filter(s => s.custom).map(s => (
          <li key={s.id} data-testid={`custom-item-${s.id}`}>
            <input type="checkbox" data-testid={`check-item-${s.id}`} checked={s.checked} onChange={() => toggleShoppingItem(s.id)} />
            <span data-testid={`item-name-${s.id}`} style={{ textDecoration: s.checked ? 'line-through' : 'none' }}>{s.name}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
