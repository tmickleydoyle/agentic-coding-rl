import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function ResultsPage() {
  const { competitions, activeCompetitionId, addResult } = useApp();
  const [athleteName, setAthleteName] = useState("");
  const [place, setPlace] = useState("");
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");

  const activeComp = competitions.find((c) => c.id === activeCompetitionId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeCompetitionId) return;
    addResult(activeCompetitionId, athleteName, Number(place), score, notes);
    setAthleteName(""); setPlace(""); setScore(""); setNotes("");
  }

  if (!activeComp) {
    return (
      <div data-testid="results-page">
        <h1>Results</h1>
        <p data-testid="no-active-competition">No active competition</p>
      </div>
    );
  }

  return (
    <div data-testid="results-page">
      <h1>Results — {activeComp.name}</h1>
      <form data-testid="add-result-form" onSubmit={handleSubmit}>
        <input data-testid="input-athlete-name" value={athleteName} onChange={(e) => setAthleteName(e.target.value)} placeholder="Athlete name" />
        <input data-testid="input-result-place" type="number" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Place" />
        <input data-testid="input-result-score" value={score} onChange={(e) => setScore(e.target.value)} placeholder="Score" />
        <input data-testid="input-result-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
        <button type="submit" data-testid="btn-add-result">Add</button>
      </form>
      <ul data-testid="results-list">
        {activeComp.results.map((r) => (
          <li key={r.id} data-testid={`result-item-${r.id}`}>
            <span data-testid={`result-athlete-${r.id}`}>{r.athleteName}</span>
            <span data-testid={`result-place-${r.id}`}>{r.place}</span>
            <span data-testid={`result-score-${r.id}`}>{r.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
