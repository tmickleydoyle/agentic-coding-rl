import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function GoalsPage() {
  const { paceGoals, savePaceGoals } = useApp();
  const [easy, setEasy] = useState(paceGoals.easy);
  const [tempo, setTempo] = useState(paceGoals.tempo);
  const [long, setLong] = useState(paceGoals.long);
  const [race, setRace] = useState(paceGoals.race);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    savePaceGoals({ easy, tempo, long, race });
  }

  return (
    <div data-testid="goals-page">
      <h1>Pace Goals</h1>
      <form data-testid="goals-form" onSubmit={handleSave}>
        <label>Easy: <input data-testid="input-goal-easy" value={easy} onChange={(e) => setEasy(e.target.value)} /></label>
        <label>Tempo: <input data-testid="input-goal-tempo" value={tempo} onChange={(e) => setTempo(e.target.value)} /></label>
        <label>Long: <input data-testid="input-goal-long" value={long} onChange={(e) => setLong(e.target.value)} /></label>
        <label>Race: <input data-testid="input-goal-race" value={race} onChange={(e) => setRace(e.target.value)} /></label>
        <button type="submit" data-testid="btn-save-goals">Save</button>
      </form>
      <p data-testid="current-goal-easy">Easy: {paceGoals.easy}</p>
    </div>
  );
}
