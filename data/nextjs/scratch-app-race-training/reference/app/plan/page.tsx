import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function PlanPage() {
  const { racePlan, runs } = useApp();
  const totalRuns = runs.length;
  const completedRuns = runs.filter((r) => r.completed).length;

  return (
    <div data-testid="plan-page">
      <h1>Race Plan</h1>
      <p data-testid="race-name">{racePlan.raceName}</p>
      <p data-testid="race-distance">{racePlan.distance}</p>
      <p data-testid="race-date">{racePlan.raceDate}</p>
      <p data-testid="plan-total-runs">Total Runs: {totalRuns}</p>
      <p data-testid="plan-completed-runs">Completed: {completedRuns}</p>
    </div>
  );
}
