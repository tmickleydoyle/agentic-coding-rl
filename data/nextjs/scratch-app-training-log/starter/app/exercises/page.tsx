"use client";
import React from "react";

export function ExercisesPage() {
  return (
    <div data-testid="exercises-page">
      <h2>Exercises</h2>
      <input data-testid="exercise-name-input" placeholder="Name" />
      <input data-testid="exercise-category-input" placeholder="Category" />
      <input data-testid="exercise-muscle-input" placeholder="Muscle Group" />
      <button data-testid="add-exercise-btn">Add Exercise</button>
      <ul data-testid="exercise-list"></ul>
    </div>
  );
}
