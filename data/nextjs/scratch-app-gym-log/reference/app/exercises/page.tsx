import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function ExercisesPage() {
  const { sessions, activeSessionId, addExercise } = useApp();
  const [name, setName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeSessionId) return;
    addExercise(activeSessionId, name, Number(sets), Number(reps), Number(weight));
    setName("");
    setSets("");
    setReps("");
    setWeight("");
  }

  if (!activeSession) {
    return (
      <div data-testid="exercises-page">
        <h1>Exercises</h1>
        <p data-testid="no-active-session">No active session</p>
      </div>
    );
  }

  return (
    <div data-testid="exercises-page">
      <h1>Exercises — {activeSession.name}</h1>
      <form data-testid="add-exercise-form" onSubmit={handleSubmit}>
        <input data-testid="input-exercise-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Exercise name" />
        <input data-testid="input-sets" type="number" value={sets} onChange={(e) => setSets(e.target.value)} placeholder="Sets" />
        <input data-testid="input-reps" type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="Reps" />
        <input data-testid="input-weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight (kg)" />
        <button type="submit" data-testid="btn-add-exercise">Add</button>
      </form>
      <ul data-testid="exercise-list">
        {activeSession.exercises.map((ex) => (
          <li key={ex.id} data-testid={`exercise-item-${ex.id}`}>
            <span data-testid={`exercise-name-${ex.id}`}>{ex.name}</span>
            <span data-testid={`exercise-sets-${ex.id}`}>{ex.sets}</span>
            <span data-testid={`exercise-reps-${ex.id}`}>{ex.reps}</span>
            <span data-testid={`exercise-weight-${ex.id}`}>{ex.weight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
