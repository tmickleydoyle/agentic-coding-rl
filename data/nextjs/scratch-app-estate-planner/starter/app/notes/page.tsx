import React from "react";

export function NotesPage() {
  return (
    <div data-testid="notes-page">
      <h1>Estate Notes</h1>
      <textarea data-testid="notes-textarea" />
      <button data-testid="save-notes-btn">Save</button>
    </div>
  );
}
