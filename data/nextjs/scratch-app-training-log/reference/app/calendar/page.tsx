"use client";
import React, { useState } from "react";
import { getLogs, getExercises, addLog } from "../../lib/store";

export function CalendarPage() {
  const [, rerender] = useState(0);
  const [exerciseId, setExerciseId] = useState("");
  const [date, setDate] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");
  const logs = getLogs();
  const exercises = getExercises();

  function handleAdd() {
    const result = addLog(parseInt(exerciseId), date, parseInt(sets), parseInt(reps), parseFloat(weight));
    if (!result) { setError("Invalid: sets/reps > 0, weight >= 0"); return; }
    setError(""); setExerciseId(""); setDate(""); setSets(""); setReps(""); setWeight("");
    rerender((n) => n + 1);
  }

  return (
    <div data-testid="calendar-page">
      <h2>Training Log</h2>
      <select data-testid="log-exercise-select" value={exerciseId} onChange={(e) => setExerciseId(e.target.value)}>
        <option value="">Select exercise</option>
        {exercises.map((ex) => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
      </select>
      <input data-testid="log-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input data-testid="log-sets-input" type="number" value={sets} onChange={(e) => setSets(e.target.value)} placeholder="Sets" />
      <input data-testid="log-reps-input" type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="Reps" />
      <input data-testid="log-weight-input" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight (kg)" />
      <button data-testid="add-log-btn" onClick={handleAdd}>Add Entry</button>
      {error && <div data-testid="log-error">{error}</div>}
      <ul data-testid="log-list">
        {logs.map((l) => (
          <li key={l.id} data-testid={`log-item-${l.id}`}>
            <span data-testid={`log-date-${l.id}`}>{l.date}</span>
            <span data-testid={`log-sets-${l.id}`}>{l.sets}</span>
            <span data-testid={`log-reps-${l.id}`}>{l.reps}</span>
            <span data-testid={`log-weight-${l.id}`}>{l.weightKg}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
