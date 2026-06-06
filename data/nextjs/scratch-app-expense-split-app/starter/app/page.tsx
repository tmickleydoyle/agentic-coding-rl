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
          <h1>Expense Splitter</h1>
          <p data-testid="group-count">0 group(s)</p>
          <p data-testid="total-expenses">$0.00 total expenses</p>
        </main>
      </div>
    </AppStateProvider>
  );
}
