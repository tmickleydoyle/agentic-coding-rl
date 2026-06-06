'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { recipes, plan, navigate } = useApp();
  return (
    <main data-testid="home-page">
      <h1>Meal Planner</h1>
      <p data-testid="recipe-count">{recipes.length} recipe(s)</p>
      <p data-testid="planned-meals">{plan.length} meal(s) planned this week</p>
      <button data-testid="plan-week-btn" onClick={() => navigate('planner')}>Plan This Week</button>
    </main>
  );
}
