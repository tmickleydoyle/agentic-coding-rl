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
          <h1>Budget Planner</h1>
          <p data-testid="total-balance">Balance: 0.00</p>
          <p data-testid="total-income">Income: 0.00</p>
          <p data-testid="total-expenses">Expenses: 0.00</p>
        </main>
      </div>
    </AppStateProvider>
  );
}
