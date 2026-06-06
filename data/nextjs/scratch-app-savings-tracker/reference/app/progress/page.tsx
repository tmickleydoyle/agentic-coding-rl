import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function ProgressPage() {
  const { goals, contributions } = useApp();

  return (
    <div data-testid="progress-page">
      <h1>Progress</h1>
      <ul data-testid="progress-list">
        {goals.map((g) => {
          const saved = contributions.filter((c) => c.goalId === g.id).reduce((sum, c) => sum + c.amount, 0);
          const pct = Math.min(100, (saved / g.target) * 100);
          return (
            <li key={g.id} data-testid={`progress-${g.id}`}>
              <span data-testid={`progress-name-${g.id}`}>{g.name}</span>
              <span data-testid={`progress-saved-${g.id}`}>${saved.toFixed(2)}</span>
              <span data-testid={`progress-target-${g.id}`}>${g.target.toFixed(2)}</span>
              <span data-testid={`progress-pct-${g.id}`}>{pct.toFixed(0)}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
