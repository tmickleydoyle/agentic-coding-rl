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
          <h1>Flash Cards</h1>
          <p data-testid="deck-count">0 deck(s)</p>
          <p data-testid="card-count">0 card(s)</p>
          <button data-testid="start-studying">Start Studying</button>
        </main>
      </div>
    </AppStateProvider>
  );
}
