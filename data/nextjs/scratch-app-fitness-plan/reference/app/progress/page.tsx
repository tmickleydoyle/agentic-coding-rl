import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function ProgressPage() {
  const { workouts } = useApp();
  const completed = workouts.filter((w) => w.completed).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div data-testid="progress-page">
      <h1>Progress</h1>
      {completed.length === 0 ? (
        <p data-testid="no-completed">No completed workouts yet.</p>
      ) : (
        <ul data-testid="completed-list">
          {completed.map((w) => (
            <li key={w.id} data-testid={`completed-item-${w.id}`}>
              <span data-testid={`completed-name-${w.id}`}>{w.name}</span>
              <span data-testid={`completed-duration-${w.id}`}>{w.duration} min</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
