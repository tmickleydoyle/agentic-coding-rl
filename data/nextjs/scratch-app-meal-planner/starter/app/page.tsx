'use client'
import React from 'react';
import { AppStateProvider } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';

export default function App() {
  return (
    <AppStateProvider>
      <div data-testid="app" data-theme="light">
        <NavBar />
        <main data-testid="home-page">
          <h1>Meal Planner</h1>
          <p data-testid="recipe-count">0 recipe(s)</p>
          <p data-testid="planned-meals">0 meal(s) planned this week</p>
          <button data-testid="plan-week-btn">Plan This Week</button>
        </main>
      </div>
    </AppStateProvider>
  );
}
