import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { FoodLog } from "../../lib/types";

export function TrackerPage() {
  const { logs, goals, todayTotal, handleDelete } = useApp();
  const remaining = Math.max(0, goals.calories - todayTotal.calories);
  const percent = Math.min(100, Math.round((todayTotal.calories / goals.calories) * 100));
  return (
    <div>
      <h1>Calorie Tracker</h1>
      <p data-testid="calories-consumed">{todayTotal.calories}</p>
      <p data-testid="calories-goal">{goals.calories}</p>
      <p data-testid="calories-remaining">{remaining}</p>
      <p data-testid="progress-percent">{percent}%</p>
      {logs.map((log: FoodLog) => (
        <div key={log.id} data-testid="food-log-item">
          {log.name}: {log.calories} kcal
          <button data-testid={`delete-log-${log.id}`} onClick={() => handleDelete(log.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
