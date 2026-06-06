import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { FinancialGoal, GoalCategory, GoalStatus } from "../../lib/types";

const CATEGORIES: GoalCategory[] = ["purchase", "savings", "investment", "lifestyle", "education", "other"];

export function GoalsPage() {
  const { goals, addGoal, deleteGoal, updateSaved } = useApp();
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [category, setCategory] = useState<GoalCategory>("other");
  const [editId, setEditId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");

  function handleAdd() {
    const target = parseFloat(targetAmount);
    if (!title || isNaN(target) || target <= 0) return;
    addGoal({ id: `fg-${Date.now()}`, title, targetAmount: target, savedAmount: 0, category, status: "active" });
    setTitle(""); setTargetAmount(""); setCategory("other");
  }

  function handleUpdateSaved(id: string) {
    const amt = parseFloat(editAmount);
    if (isNaN(amt) || amt < 0) return;
    updateSaved(id, amt);
    setEditId(null);
    setEditAmount("");
  }

  return (
    <div data-testid="goals-page">
      <h1>Goals</h1>
      <div data-testid="add-goal-form">
        <input data-testid="goal-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input data-testid="goal-target" type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="Target Amount" />
        <select data-testid="goal-category" value={category} onChange={(e) => setCategory(e.target.value as GoalCategory)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button data-testid="add-goal-btn" onClick={handleAdd}>Add Goal</button>
      </div>
      <ul data-testid="goal-list">
        {goals.map((g) => {
          const pct = Math.min(100, (g.savedAmount / g.targetAmount) * 100);
          return (
            <li key={g.id} data-testid={`goal-${g.id}`}>
              <span data-testid={`goal-title-${g.id}`}>{g.title}</span>
              <span data-testid={`goal-saved-${g.id}`}>${g.savedAmount.toFixed(2)}</span>
              <span data-testid={`goal-target-${g.id}`}>${g.targetAmount.toFixed(2)}</span>
              <span data-testid={`goal-pct-${g.id}`}>{pct.toFixed(0)}%</span>
              <span data-testid={`goal-status-${g.id}`}>{g.status}</span>
              {editId === g.id ? (
                <span>
                  <input data-testid={`edit-saved-${g.id}`} type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
                  <button data-testid={`save-saved-${g.id}`} onClick={() => handleUpdateSaved(g.id)}>Save</button>
                </span>
              ) : (
                <button data-testid={`edit-goal-${g.id}`} onClick={() => { setEditId(g.id); setEditAmount(String(g.savedAmount)); }}>Update Saved</button>
              )}
              <button data-testid={`delete-goal-${g.id}`} onClick={() => deleteGoal(g.id)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
