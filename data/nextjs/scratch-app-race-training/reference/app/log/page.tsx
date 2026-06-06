import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function LogPage() {
  const { runs, toggleRun } = useApp();
  const totalKm = runs.filter((r) => r.completed).reduce((s, r) => s + r.distance, 0);

  return (
    <div data-testid="log-page">
      <h1>Training Log</h1>
      <p data-testid="total-km-logged">Total km logged: {totalKm}</p>
      <ul data-testid="log-list">
        {runs.map((r) => (
          <li key={r.id} data-testid={`log-item-${r.id}`}>
            <span data-testid={`log-type-${r.id}`}>{r.type}</span>
            <span data-testid={`log-distance-${r.id}`}>{r.distance}km</span>
            <span data-testid={`log-status-${r.id}`}>{r.completed ? "done" : "pending"}</span>
            <button data-testid={`btn-toggle-run-${r.id}`} onClick={() => toggleRun(r.id)}>
              {r.completed ? "Undo" : "Complete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
