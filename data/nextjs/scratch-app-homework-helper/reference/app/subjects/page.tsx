import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { addNote, deleteNote } from "../../lib/store";

export default function SubjectsPage() {
  const { assignments, notes, setNotes } = useApp();
  const subjects = Array.from(new Set(assignments.map(a => a.subject)));
  const [noteSubject, setNoteSubject] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [error, setError] = useState("");

  function handleAddNote() {
    if (!noteSubject || !noteTitle.trim() || !noteContent.trim()) { setError("Subject, title, and content required"); return; }
    const n = addNote({ subject: noteSubject, title: noteTitle.trim(), content: noteContent.trim(), createdAt: new Date().toISOString().slice(0, 10) });
    setNotes([...notes, n]);
    setNoteSubject(""); setNoteTitle(""); setNoteContent(""); setError("");
  }

  function handleDeleteNote(id: string) {
    deleteNote(id);
    setNotes(notes.filter(n => n.id !== id));
  }

  return (
    <div data-testid="subjects-page">
      <h2>Subjects & Notes</h2>
      <div data-testid="subject-count">{subjects.length} subjects</div>
      <ul data-testid="subject-list">
        {subjects.map(s => {
          const subjectNotes = notes.filter(n => n.subject === s);
          const subjectAssignments = assignments.filter(a => a.subject === s);
          return (
            <li key={s} data-testid={`subject-item-${s.toLowerCase()}`}>
              <span data-testid={`subject-name-${s.toLowerCase()}`}>{s}</span>
              <span data-testid={`subject-assignments-${s.toLowerCase()}`}>{subjectAssignments.length} assignments</span>
              <span data-testid={`subject-notes-${s.toLowerCase()}`}>{subjectNotes.length} notes</span>
            </li>
          );
        })}
      </ul>
      {error && <div data-testid="note-error">{error}</div>}
      <div data-testid="add-note-form">
        <select data-testid="select-note-subject" value={noteSubject} onChange={e => setNoteSubject(e.target.value)}>
          <option value="">Select subject</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input data-testid="input-note-title" value={noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder="Note title" />
        <textarea data-testid="input-note-content" value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="Note content" />
        <button data-testid="btn-add-note" onClick={handleAddNote}>Add Note</button>
      </div>
      <ul data-testid="note-list">
        {notes.map(n => (
          <li key={n.id} data-testid={`note-item-${n.id}`}>
            <span data-testid={`note-title-${n.id}`}>{n.title}</span>
            <span data-testid={`note-subject-${n.id}`}>{n.subject}</span>
            <button data-testid={`btn-delete-note-${n.id}`} onClick={() => handleDeleteNote(n.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
