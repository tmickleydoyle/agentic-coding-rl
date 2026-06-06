'use client'
import React from 'react';
export function RoutinesPage() {
  return (
    <main data-testid="routines-page">
      <h2>Routines</h2>
      <div data-testid="add-routine-form">
        <input data-testid="routine-name-input" placeholder="Routine name" />
        <input data-testid="routine-minutes-input" type="number" placeholder="Est. minutes" />
        <div data-testid="exercise-checkboxes" />
        <button data-testid="add-routine-btn">Add Routine</button>
      </div>
      <ul data-testid="routines-list" />
    </main>
  );
}
