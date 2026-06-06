'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';
import { Exercise } from '../../lib/types';

export function ExercisesPage() {
  const { exercises, addExercise, deleteExercise } = useApp();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Exercise['category']>('strength');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!name.trim()) { setError('Name required'); return; }
    const ok = addExercise(name, category, muscleGroup, description);
    if (!ok) { setError('Failed'); return; }
    setName(''); setMuscleGroup(''); setDescription(''); setError('');
  };

  return (
    <main data-testid="exercises-page">
      <h2>Exercises</h2>
      <div data-testid="add-exercise-form">
        <input data-testid="exercise-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <select data-testid="exercise-category-select" value={category} onChange={e => setCategory(e.target.value as Exercise['category'])}>
          <option value="strength">Strength</option>
          <option value="cardio">Cardio</option>
          <option value="flexibility">Flexibility</option>
        </select>
        <input data-testid="exercise-muscle-input" value={muscleGroup} onChange={e => setMuscleGroup(e.target.value)} placeholder="Muscle group" />
        <input data-testid="exercise-desc-input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <button data-testid="add-exercise-btn" onClick={handleAdd}>Add Exercise</button>
        {error && <span data-testid="exercise-error">{error}</span>}
      </div>
      <ul data-testid="exercises-list">
        {exercises.map(e => (
          <li key={e.id} data-testid={`exercise-item-${e.id}`}>
            <span data-testid={`exercise-name-${e.id}`}>{e.name}</span>
            <span data-testid={`exercise-category-${e.id}`}>{e.category}</span>
            <button data-testid={`delete-exercise-${e.id}`} onClick={() => deleteExercise(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
