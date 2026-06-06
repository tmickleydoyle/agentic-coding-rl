'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function RoutinesPage() {
  const { routines, exercises, addRoutine, deleteRoutine } = useApp();
  const [name, setName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [error, setError] = useState('');

  const toggleExercise = (id: string) => {
    setSelectedExercises(prev =>
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    if (!name.trim()) { setError('Name required'); return; }
    const ok = addRoutine(name, selectedExercises, parseInt(estimatedMinutes) || 0);
    if (!ok) { setError('Failed'); return; }
    setName(''); setSelectedExercises([]); setEstimatedMinutes(''); setError('');
  };

  const getExerciseName = (id: string) => exercises.find(e => e.id === id)?.name ?? id;

  return (
    <main data-testid="routines-page">
      <h2>Routines</h2>
      <div data-testid="add-routine-form">
        <input data-testid="routine-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Routine name" />
        <input data-testid="routine-minutes-input" type="number" value={estimatedMinutes} onChange={e => setEstimatedMinutes(e.target.value)} placeholder="Est. minutes" />
        <div data-testid="exercise-checkboxes">
          {exercises.map(ex => (
            <label key={ex.id}>
              <input
                type="checkbox"
                data-testid={`routine-exercise-check-${ex.id}`}
                checked={selectedExercises.includes(ex.id)}
                onChange={() => toggleExercise(ex.id)}
              />
              {ex.name}
            </label>
          ))}
        </div>
        <button data-testid="add-routine-btn" onClick={handleAdd}>Add Routine</button>
        {error && <span data-testid="routine-error">{error}</span>}
      </div>
      <ul data-testid="routines-list">
        {routines.map(r => (
          <li key={r.id} data-testid={`routine-item-${r.id}`}>
            <span data-testid={`routine-name-${r.id}`}>{r.name}</span>
            <span data-testid={`routine-minutes-${r.id}`}>{r.estimatedMinutes} min</span>
            <span data-testid={`routine-exercises-${r.id}`}>{r.exerciseIds.map(getExerciseName).join(', ')}</span>
            <button data-testid={`delete-routine-${r.id}`} onClick={() => deleteRoutine(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
