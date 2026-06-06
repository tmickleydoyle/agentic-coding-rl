import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { WorkoutType } from "../../lib/types";

export default function WorkoutsPage() {
  const { workouts, addWorkout, removeWorkout, toggleComplete } = useApp();
  const [name, setName] = useState("");
  const [type, setType] = useState<WorkoutType>("cardio");
  const [duration, setDuration] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addWorkout(name, type, Number(duration));
    setName("");
    setType("cardio");
    setDuration("");
  }

  return (
    <div data-testid="workouts-page">
      <h1>Workouts</h1>
      <form data-testid="add-workout-form" onSubmit={handleSubmit}>
        <input
          data-testid="input-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <select
          data-testid="input-type"
          value={type}
          onChange={(e) => setType(e.target.value as WorkoutType)}
        >
          <option value="cardio">Cardio</option>
          <option value="strength">Strength</option>
          <option value="flexibility">Flexibility</option>
        </select>
        <input
          data-testid="input-duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (min)"
        />
        <button type="submit" data-testid="btn-add-workout">Add</button>
      </form>
      <ul data-testid="workout-list">
        {workouts.map((w) => (
          <li key={w.id} data-testid={`workout-item-${w.id}`}>
            <span data-testid={`workout-name-${w.id}`}>{w.name}</span>
            <span data-testid={`workout-type-${w.id}`}>{w.type}</span>
            <span data-testid={`workout-duration-${w.id}`}>{w.duration}</span>
            <span data-testid={`workout-completed-${w.id}`}>{w.completed ? "done" : "pending"}</span>
            <button data-testid={`btn-complete-${w.id}`} onClick={() => toggleComplete(w.id)}>
              {w.completed ? "Undo" : "Complete"}
            </button>
            <button data-testid={`btn-remove-${w.id}`} onClick={() => removeWorkout(w.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
