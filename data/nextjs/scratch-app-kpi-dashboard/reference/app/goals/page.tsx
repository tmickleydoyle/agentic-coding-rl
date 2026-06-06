import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Goal, Quarter } from "../../lib/types";

const QUARTERS: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];

export default function GoalsPage() {
  const { metrics, goals, setGoals } = useApp();
  const [metricId, setMetricId] = useState("");
  const [quarter, setQuarter] = useState<Quarter>("Q1");
  const [year, setYear] = useState("2024");
  const [targetValue, setTargetValue] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    const tgt = parseFloat(targetValue);
    if (!metricId) { setError("Select metric"); return; }
    if (isNaN(tgt)) { setError("Target value required"); return; }
    setError("");
    const goal: Goal = { id: String(Date.now()), metricId, quarter, year: parseInt(year, 10), targetValue: tgt };
    setGoals([...goals, goal]);
    setTargetValue("");
  }

  return (
    <div data-testid="goals-page">
      <h1>Goals</h1>
      {error && <div data-testid="goal-error">{error}</div>}
      <div data-testid="add-goal-form">
        <select data-testid="goal-metric-select" value={metricId} onChange={(e) => setMetricId(e.target.value)}>
          <option value="">Select metric</option>
          {metrics.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select data-testid="goal-quarter-select" value={quarter} onChange={(e) => setQuarter(e.target.value as Quarter)}>
          {QUARTERS.map((q) => <option key={q} value={q}>{q}</option>)}
        </select>
        <input data-testid="goal-year-input" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        <input data-testid="goal-target-input" type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="Target" />
        <button data-testid="add-goal-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul data-testid="goal-list">
        {goals.map((g) => {
          const m = metrics.find((x) => x.id === g.metricId);
          return (
            <li key={g.id} data-testid={`goal-item-${g.id}`}>
              <span data-testid={`goal-metric-${g.id}`}>{m ? m.name : "Unknown"}</span>
              <span data-testid={`goal-quarter-${g.id}`}>{g.quarter} {g.year}</span>
              <span data-testid={`goal-target-${g.id}`}>{g.targetValue}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
