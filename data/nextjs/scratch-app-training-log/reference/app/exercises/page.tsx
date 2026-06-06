"use client";
import React, { useState } from "react";
import { getExercises, addExercise, removeExercise } from "../../lib/store";

export function ExercisesPage() {
  const [, rerender] = useState(0);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const exercises = getExercises();

  function handleAdd() {
    if (!name.trim() || !category.trim() || !muscleGroup.trim()) return;
    addExercise(name.trim(), category.trim(), muscleGroup.trim());
    setName(""); setCategory(""); setMuscleGroup("");
    rerender((n) => n + 1);
  }

  return (
    <div data-testid="exercises-page">
      <h2>Exercises</h2>
      <input data-testid="exercise-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input data-testid="exercise-category-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
      <input data-testid="exercise-muscle-input" value={muscleGroup} onChange={(e) => setMuscleGroup(e.target.value)} placeholder="Muscle Group" />
      <button data-testid="add-exercise-btn" onClick={handleAdd}>Add Exercise</button>
      <ul data-testid="exercise-list">
        {exercises.map((ex) => (
          <li key={ex.id} data-testid={`exercise-item-${ex.id}`}>
            <span data-testid={`exercise-name-${ex.id}`}>{ex.name}</span>
            <span data-testid={`exercise-category-${ex.id}`}>{ex.category}</span>
            <button data-testid={`remove-exercise-${ex.id}`} onClick={() => { removeExercise(ex.id); rerender((n) => n + 1); }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
