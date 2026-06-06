import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Contribution } from "../../lib/types";

export function ContributionsPage() {
  const { goals, contributions, addContribution } = useApp();
  const [goalId, setGoalId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  function handleAdd() {
    const amt = parseFloat(amount);
    if (!goalId || isNaN(amt) || amt <= 0 || !date) return;
    addContribution({ id: `c-${Date.now()}`, goalId, amount: amt, date });
    setAmount(""); setDate("");
  }

  return (
    <div data-testid="contributions-page">
      <h1>Contributions</h1>
      <div data-testid="add-contribution-form">
        <select data-testid="contribution-goal" value={goalId} onChange={(e) => setGoalId(e.target.value)}>
          <option value="">Select goal</option>
          {goals.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <input data-testid="contribution-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input data-testid="contribution-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button data-testid="add-contribution-btn" onClick={handleAdd}>Add Contribution</button>
      </div>
      <ul data-testid="contribution-list">
        {contributions.map((c) => (
          <li key={c.id} data-testid={`contribution-${c.id}`}>
            <span data-testid={`contribution-goal-${c.id}`}>{c.goalId}</span>
            <span data-testid={`contribution-amount-${c.id}`}>${c.amount.toFixed(2)}</span>
            <span data-testid={`contribution-date-${c.id}`}>{c.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
