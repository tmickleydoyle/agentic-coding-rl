import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { addDrill } from "../../lib/store";
import type { Operation, Difficulty } from "../../lib/types";

const OPERATIONS: Operation[] = ["addition", "subtraction", "multiplication", "division"];
const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export default function DrillsPage() {
  const { drills, setDrills } = useApp();
  const [operation, setOperation] = useState<Operation>("addition");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [totalProblems, setTotalProblems] = useState("10");
  const [correctAnswers, setCorrectAnswers] = useState("");
  const [timeTaken, setTimeTaken] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    const total = parseInt(totalProblems, 10);
    const correct = parseInt(correctAnswers, 10);
    const time = parseInt(timeTaken, 10);
    if (isNaN(total) || total < 1) { setError("Total problems must be >= 1"); return; }
    if (isNaN(correct) || correct < 0 || correct > total) { setError("Correct answers must be 0 to total"); return; }
    if (isNaN(time) || time < 0) { setError("Time must be non-negative"); return; }
    const d = addDrill({ operation, difficulty, totalProblems: total, correctAnswers: correct, timeTakenSeconds: time, date: new Date().toISOString().slice(0, 10) });
    setDrills([...drills, d]);
    setCorrectAnswers(""); setTimeTaken(""); setError("");
  }

  return (
    <div data-testid="drills-page">
      <h2>Drill Sessions</h2>
      <div data-testid="drill-count">{drills.length} sessions</div>
      {error && <div data-testid="drill-error">{error}</div>}
      <ul data-testid="drill-list">
        {drills.map(d => (
          <li key={d.id} data-testid={`drill-item-${d.id}`}>
            <span data-testid={`drill-operation-${d.id}`}>{d.operation}</span>
            <span data-testid={`drill-difficulty-${d.id}`}>{d.difficulty}</span>
            <span data-testid={`drill-score-${d.id}`}>{d.correctAnswers}/{d.totalProblems}</span>
            <span data-testid={`drill-time-${d.id}`}>{d.timeTakenSeconds}s</span>
            <span data-testid={`drill-pct-${d.id}`}>{Math.round((d.correctAnswers / d.totalProblems) * 100)}%</span>
          </li>
        ))}
      </ul>
      <div data-testid="add-drill-form">
        <select data-testid="select-drill-operation" value={operation} onChange={e => setOperation(e.target.value as Operation)}>
          {OPERATIONS.map(op => <option key={op} value={op}>{op}</option>)}
        </select>
        <select data-testid="select-drill-difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)}>
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <input data-testid="input-total" value={totalProblems} onChange={e => setTotalProblems(e.target.value)} placeholder="Total problems" />
        <input data-testid="input-correct" value={correctAnswers} onChange={e => setCorrectAnswers(e.target.value)} placeholder="Correct answers" />
        <input data-testid="input-time" value={timeTaken} onChange={e => setTimeTaken(e.target.value)} placeholder="Time (seconds)" />
        <button data-testid="btn-add-drill" onClick={handleAdd}>Log Drill</button>
      </div>
    </div>
  );
}
