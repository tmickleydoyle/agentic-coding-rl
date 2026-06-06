import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function CompetitionsPage() {
  const { competitions, addCompetition, deleteCompetition, activeCompetitionId, setActiveCompetitionId } = useApp();
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addCompetition(name, sport, date, location);
    setName(""); setSport(""); setDate(""); setLocation("");
  }

  return (
    <div data-testid="competitions-page">
      <h1>Competitions</h1>
      <form data-testid="add-competition-form" onSubmit={handleSubmit}>
        <input data-testid="input-comp-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="input-comp-sport" value={sport} onChange={(e) => setSport(e.target.value)} placeholder="Sport" />
        <input data-testid="input-comp-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="input-comp-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        <button type="submit" data-testid="btn-add-competition">Add</button>
      </form>
      <ul data-testid="competitions-list">
        {competitions.map((c) => (
          <li key={c.id} data-testid={`competition-item-${c.id}`}>
            <button data-testid={`btn-select-comp-${c.id}`} onClick={() => setActiveCompetitionId(c.id)}>
              <span data-testid={`comp-name-${c.id}`}>{c.name}</span>
            </button>
            {activeCompetitionId === c.id && <span data-testid="active-comp-indicator"> (active)</span>}
            <span data-testid={`comp-date-${c.id}`}>{c.date}</span>
            <button data-testid={`btn-delete-comp-${c.id}`} onClick={() => deleteCompetition(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
