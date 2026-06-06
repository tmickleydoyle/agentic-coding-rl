import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export function NotesPage() {
  const { notes, saveNotes } = useApp();
  const [draft, setDraft] = useState(notes);

  const handleSave = () => {
    saveNotes(draft);
  };

  return (
    <div data-testid="notes-page">
      <h1>Estate Notes</h1>
      <textarea data-testid="notes-textarea" value={draft} onChange={(e) => setDraft(e.target.value)} />
      <button data-testid="save-notes-btn" onClick={handleSave}>Save</button>
    </div>
  );
}
