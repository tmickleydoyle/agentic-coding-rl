import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Goal } from "../../lib/types";

export function GoalsPage() {
  const { goals, addGoal, deleteGoal } = useApp();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");

  function handleAdd() {
    const tgt = parseFloat(target);
    if (!name || isNaN(tgt) || tgt <= 0 || !deadline) return;
    addGoal({ id: `g-${Date.now()}`, name, target: tgt, deadline });
    setName(""); setTarget(""); setDeadline("");
  }

  return (
    <div data-testid="goals-page">
      <h1>Goals</h1>
      <div data-testid="add-goal-form">
        <input data-testid="goal-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Goal name" />
        <input data-testid="goal-target" type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Target" />
        <input data-testid="goal-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        <button data-testid="add-goal-btn" onClick={handleAdd}>Add Goal</button>
      </div>
      <ul data-testid="goal-list">
        {goals.map((g) => (
          <li key={g.id} data-testid={`goal-${g.id}`}>
            <span data-testid={`goal-name-${g.id}`}>{g.name}</span>
            <span data-testid={`goal-target-${g.id}`}>${g.target.toFixed(2)}</span>
            <span data-testid={`goal-deadline-${g.id}`}>{g.deadline}</span>
            <button data-testid={`delete-goal-${g.id}`} onClick={() => deleteGoal(g.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
