import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function HistoryPage() {
  const { sessions } = useApp();
  return (
    <div data-testid="history-page">
      <h1>History</h1>
      {sessions.map((s) => (
        <div key={s.id} data-testid={`history-session-${s.id}`}>
          <strong data-testid={`history-session-name-${s.id}`}>{s.name}</strong>
          <span data-testid={`history-session-date-${s.id}`}> — {s.date}</span>
          <ul>
            {s.exercises.map((ex) => (
              <li key={ex.id} data-testid={`history-exercise-${ex.id}`}>
                {ex.name} {ex.sets}x{ex.reps} @ {ex.weight}kg
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
