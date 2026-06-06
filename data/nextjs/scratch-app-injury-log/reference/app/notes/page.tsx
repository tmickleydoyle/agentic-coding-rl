import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function NotesPage() {
  const { injuries, activeInjuryId, addNote } = useApp();
  const [text, setText] = useState("");
  const [date, setDate] = useState("");

  const activeInjury = injuries.find((i) => i.id === activeInjuryId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeInjuryId) return;
    addNote(activeInjuryId, text, date);
    setText("");
    setDate("");
  }

  if (!activeInjury) {
    return (
      <div data-testid="notes-page">
        <h1>Notes</h1>
        <p data-testid="no-active-injury-notes">No active injury</p>
      </div>
    );
  }

  return (
    <div data-testid="notes-page">
      <h1>Notes — {activeInjury.bodyPart}</h1>
      <form data-testid="add-note-form" onSubmit={handleSubmit}>
        <input data-testid="input-note-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Note text" />
        <input data-testid="input-note-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button type="submit" data-testid="btn-add-note">Add Note</button>
      </form>
      <ul data-testid="notes-list">
        {activeInjury.notes.map((n) => (
          <li key={n.id} data-testid={`note-item-${n.id}`}>
            <span data-testid={`note-text-${n.id}`}>{n.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
