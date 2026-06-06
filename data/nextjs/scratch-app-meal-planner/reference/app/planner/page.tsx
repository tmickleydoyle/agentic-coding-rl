'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import { PlanEntry } from '../../lib/types';

const DAYS: PlanEntry['day'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MEAL_TYPES: PlanEntry['mealType'][] = ['breakfast', 'lunch', 'dinner'];

export function PlannerPage() {
  const { recipes, plan, setPlanEntry, removePlanEntry } = useApp();
  const [selectedDay, setSelectedDay] = useState<PlanEntry['day']>('Mon');
  const [selectedMealType, setSelectedMealType] = useState<PlanEntry['mealType']>('breakfast');
  const [selectedRecipeId, setSelectedRecipeId] = useState('');

  const handlePlan = () => {
    if (!selectedRecipeId) return;
    setPlanEntry(selectedDay, selectedMealType, selectedRecipeId);
    setSelectedRecipeId('');
  };

  const getRecipeName = (id: string) => recipes.find(r => r.id === id)?.name ?? id;

  return (
    <main data-testid="planner-page">
      <h2>Meal Planner</h2>
      <div data-testid="add-plan-form">
        <select data-testid="plan-day-select" value={selectedDay} onChange={e => setSelectedDay(e.target.value as PlanEntry['day'])}>
          {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select data-testid="plan-mealtype-select" value={selectedMealType} onChange={e => setSelectedMealType(e.target.value as PlanEntry['mealType'])}>
          {MEAL_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select data-testid="plan-recipe-select" value={selectedRecipeId} onChange={e => setSelectedRecipeId(e.target.value)}>
          <option value="">-- Select Recipe --</option>
          {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <button data-testid="add-plan-btn" onClick={handlePlan}>Add to Plan</button>
      </div>
      <ul data-testid="plan-list">
        {plan.map(p => (
          <li key={p.id} data-testid={`plan-item-${p.id}`}>
            <span data-testid={`plan-day-${p.id}`}>{p.day}</span>
            <span data-testid={`plan-mealtype-${p.id}`}>{p.mealType}</span>
            <span data-testid={`plan-recipe-${p.id}`}>{getRecipeName(p.recipeId)}</span>
            <button data-testid={`remove-plan-${p.id}`} onClick={() => removePlanEntry(p.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
