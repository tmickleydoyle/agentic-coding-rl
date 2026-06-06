import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export function LogWaterPage() {
  const { handleAdd, dailyGoal, handleSetGoal } = useApp();
  const [cups, setCups] = useState(1);
  const [note, setNote] = useState("");
  const [time, setTime] = useState("08:00");
  const [goalInput, setGoalInput] = useState(dailyGoal);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cups <= 0) { setError("Cups must be greater than 0."); return; }
    setError("");
    handleSetGoal(goalInput);
    handleAdd({ date: "2024-05-20", cups, note, time });
  };

  return (
    <div>
      <h1>Log Water</h1>
      {error && <p data-testid="error-message">{error}</p>}
      <form data-testid="log-water-form" onSubmit={handleSubmit}>
        <input data-testid="input-cups" type="number" step="0.5" min="0.5" value={cups} onChange={(e) => setCups(Number(e.target.value))} />
        <input data-testid="input-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
        <input data-testid="input-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <input data-testid="input-goal" type="number" value={goalInput} onChange={(e) => setGoalInput(Number(e.target.value))} placeholder="Daily goal (cups)" />
        <button type="submit" data-testid="submit-btn">Log</button>
      </form>
    </div>
  );
}
