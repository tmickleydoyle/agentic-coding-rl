import React, { useState } from "react";
import { getAllNotes, getContacts, addNote } from "../../lib/store";

export function NotesPage() {
  const [filter, setFilter] = useState("all");
  const [contactId, setContactId] = useState("");
  const [content, setContent] = useState("");
  const [, forceUpdate] = useState(0);

  const contacts = getContacts();
  const allNotes = getAllNotes();
  const filtered = filter === "all" ? allNotes : allNotes.filter((n) => n.contactId === filter);

  const handleAdd = () => {
    if (!contactId || !content.trim()) return;
    addNote(contactId, content.trim());
    setContent("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="notes-page">
      <h2>Notes</h2>
      <select
        data-testid="contact-filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All</option>
        {contacts.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {filtered.length === 0 && <div data-testid="empty-notes">No notes yet</div>}
      {filtered.map((n) => (
        <div key={n.id} data-testid="note-item">
          <span data-testid="note-content">{n.content}</span>
          <span data-testid="note-contact">{n.contactName}</span>
        </div>
      ))}
      <div data-testid="add-note-form">
        <select
          data-testid="note-contact-select"
          value={contactId}
          onChange={(e) => setContactId(e.target.value)}
        >
          <option value="">Select contact</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <textarea
          data-testid="note-content-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button data-testid="add-note-btn" onClick={handleAdd}>
          Add Note
        </button>
      </div>
    </div>
  );
}
