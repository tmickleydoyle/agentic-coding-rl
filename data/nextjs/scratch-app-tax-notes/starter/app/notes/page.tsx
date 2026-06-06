import React from "react";
export function NotesPage() {
  return (
    <div data-testid="notes-page">
      <div data-testid="add-note-form">
        <input data-testid="note-title" />
        <textarea data-testid="note-content" />
        <input data-testid="note-date" type="date" />
        <button data-testid="add-note-btn">Add Note</button>
      </div>
      <ul data-testid="note-list"></ul>
    </div>
  );
}
