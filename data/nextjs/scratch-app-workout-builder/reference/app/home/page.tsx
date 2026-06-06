'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { exercises, routines, logs } = useApp();
  return (
    <main data-testid="home-page">
      <h1>Workout Builder</h1>
      <p data-testid="exercise-count">{exercises.length} exercises</p>
      <p data-testid="routine-count">{routines.length} routines</p>
      <p data-testid="session-count">{logs.length} sessions logged</p>
    </main>
  );
}
