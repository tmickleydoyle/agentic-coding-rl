'use client'
import React from 'react';
export function ExercisesPage() {
  return (
    <main data-testid="exercises-page">
      <h2>Exercises</h2>
      <div data-testid="add-exercise-form">
        <input data-testid="exercise-name-input" placeholder="Name" />
        <select data-testid="exercise-category-select"><option value="strength">Strength</option><option value="cardio">Cardio</option><option value="flexibility">Flexibility</option></select>
        <input data-testid="exercise-muscle-input" placeholder="Muscle group" />
        <input data-testid="exercise-desc-input" placeholder="Description" />
        <button data-testid="add-exercise-btn">Add Exercise</button>
      </div>
      <ul data-testid="exercises-list" />
    </main>
  );
}
