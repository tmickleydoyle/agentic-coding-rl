import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { TaxNote } from "../../lib/types";

export function NotesPage() {
  const { taxNotes, addTaxNote, deleteTaxNote } = useApp();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");

  function handleAdd() {
    if (!title || !content || !date) return;
    addTaxNote({ id: `n-${Date.now()}`, title, content, date });
    setTitle(""); setContent(""); setDate("");
  }

  return (
    <div data-testid="notes-page">
      <h1>Tax Notes</h1>
      <div data-testid="add-note-form">
        <input data-testid="note-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea data-testid="note-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
        <input data-testid="note-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button data-testid="add-note-btn" onClick={handleAdd}>Add Note</button>
      </div>
      <ul data-testid="note-list">
        {taxNotes.map((n) => (
          <li key={n.id} data-testid={`note-${n.id}`}>
            <span data-testid={`note-title-${n.id}`}>{n.title}</span>
            <span data-testid={`note-content-${n.id}`}>{n.content}</span>
            <span data-testid={`note-date-${n.id}`}>{n.date}</span>
            <button data-testid={`delete-note-${n.id}`} onClick={() => deleteTaxNote(n.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
