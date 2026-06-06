"use client";
import React, { useState } from "react";
import { getGoals, addGoal, toggleGoal } from "../../lib/store";

export function GoalsPage() {
  const [, rerender] = useState(0);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("");
  const [deadline, setDeadline] = useState("");
  const goals = getGoals();
  const completedCount = goals.filter((g) => g.completed).length;

  function handleAdd() {
    if (!title.trim() || !unit.trim() || !deadline) return;
    addGoal(title.trim(), parseFloat(target), unit.trim(), deadline);
    setTitle(""); setTarget(""); setUnit(""); setDeadline("");
    rerender((n) => n + 1);
  }

  return (
    <div data-testid="goals-page">
      <h2>Goals</h2>
      <div data-testid="completed-count">{completedCount}</div>
      <div data-testid="total-goals">{goals.length}</div>
      <input data-testid="goal-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input data-testid="goal-target-input" type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Target" />
      <input data-testid="goal-unit-input" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Unit" />
      <input data-testid="goal-deadline-input" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      <button data-testid="add-goal-btn" onClick={handleAdd}>Add Goal</button>
      <ul data-testid="goal-list">
        {goals.map((g) => (
          <li key={g.id} data-testid={`goal-item-${g.id}`}>
            <span data-testid={`goal-title-${g.id}`}>{g.title}</span>
            <span data-testid={`goal-completed-${g.id}`}>{g.completed ? "true" : "false"}</span>
            <button data-testid={`toggle-goal-${g.id}`} onClick={() => { toggleGoal(g.id); rerender((n) => n + 1); }}>Toggle</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
