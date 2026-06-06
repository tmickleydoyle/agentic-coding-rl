import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function SessionsPage() {
  const { sessions, addSession, deleteSession, activeSessionId, setActiveSessionId } = useApp();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addSession(name, date);
    setName("");
    setDate("");
  }

  return (
    <div data-testid="sessions-page">
      <h1>Gym Sessions</h1>
      <form data-testid="add-session-form" onSubmit={handleSubmit}>
        <input data-testid="input-session-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Session name" />
        <input data-testid="input-session-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button type="submit" data-testid="btn-add-session">Add</button>
      </form>
      <ul data-testid="session-list">
        {sessions.map((s) => (
          <li key={s.id} data-testid={`session-item-${s.id}`}>
            <button data-testid={`btn-select-${s.id}`} onClick={() => setActiveSessionId(s.id)}>
              <span data-testid={`session-name-${s.id}`}>{s.name}</span>
            </button>
            {activeSessionId === s.id && <span data-testid="active-indicator"> (active)</span>}
            <span data-testid={`session-date-${s.id}`}>{s.date}</span>
            <button data-testid={`btn-delete-${s.id}`} onClick={() => deleteSession(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
