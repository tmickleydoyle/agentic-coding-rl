import React from "react";
import { useApp } from "../../components/AppStateProvider";

const MILESTONES = [25, 50, 75, 100];

export function MilestonesPage() {
  const { goals } = useApp();
  return (
    <div data-testid="milestones-page">
      <h1>Milestones</h1>
      <ul data-testid="milestone-goals">
        {goals.map((g) => {
          const pct = (g.savedAmount / g.targetAmount) * 100;
          return (
            <li key={g.id} data-testid={`milestone-goal-${g.id}`}>
              <span data-testid={`milestone-title-${g.id}`}>{g.title}</span>
              <ul data-testid={`milestone-list-${g.id}`}>
                {MILESTONES.map((m) => (
                  <li key={m} data-testid={`milestone-${g.id}-${m}`}>
                    <span data-testid={`milestone-label-${g.id}-${m}`}>{m}%</span>
                    <span data-testid={`milestone-reached-${g.id}-${m}`}>{pct >= m ? "reached" : "not reached"}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
