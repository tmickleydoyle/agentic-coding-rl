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
          <h1>Workout Builder</h1>
          <p data-testid="exercise-count">0 exercises</p>
          <p data-testid="routine-count">0 routines</p>
          <p data-testid="session-count">0 sessions logged</p>
        </main>
      </div>
    </AppStateProvider>
  );
}
