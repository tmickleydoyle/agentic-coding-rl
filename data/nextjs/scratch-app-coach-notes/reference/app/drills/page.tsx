import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function DrillsPage() {
  const { sessions, activeSessionId, setActiveSessionId, addDrill } = useApp();
  const [name, setName] = useState("");
  const [reps, setReps] = useState("");
  const [notes, setNotes] = useState("");

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeSessionId) return;
    addDrill(activeSessionId, name, Number(reps), notes);
    setName("");
    setReps("");
    setNotes("");
  }

  return (
    <div data-testid="drills-page">
      <h1>Drills</h1>
      {!activeSession && <p data-testid="no-active-session">No active session</p>}
      <ul data-testid="sessions-list">
        {sessions.map((s) => (
          <li key={s.id} data-testid={`sessions-list-item-${s.id}`}>
            <button data-testid={`btn-select-session-${s.id}`} onClick={() => setActiveSessionId(s.id)}>
              {s.focus}
            </button>
          </li>
        ))}
      </ul>
      {activeSession && (
        <>
          <form data-testid="add-drill-form" onSubmit={handleSubmit}>
            <input data-testid="input-drill-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Drill name" />
            <input data-testid="input-drill-reps" type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="Reps" />
            <input data-testid="input-drill-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
            <button type="submit" data-testid="btn-add-drill">Add</button>
          </form>
          <ul data-testid="drill-list">
            {activeSession.drills.map((d) => (
              <li key={d.id} data-testid={`drill-item-${d.id}`}>
                <span data-testid={`drill-name-${d.id}`}>{d.name}</span>
                <span data-testid={`drill-reps-${d.id}`}>{d.reps}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
