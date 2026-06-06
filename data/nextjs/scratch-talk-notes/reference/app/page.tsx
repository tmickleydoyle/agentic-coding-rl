import { useState } from "react";

interface Note {
  id: number;
  session: string;
  speaker: string;
  tag: string;
  note: string;
}

const SEED_NOTES: Note[] = [
  { id: 1, session: "Keynote: Future of AI", speaker: "Dr. Ada Lovelace", tag: "ai", note: "Discussed transformer scaling laws and emergent capabilities." },
  { id: 2, session: "React Patterns in 2025", speaker: "Jordan Lee", tag: "frontend", note: "Server components + signals pattern shown. Check repo link." },
  { id: 3, session: "Scaling Microservices", speaker: "Sam Rivera", tag: "backend", note: "Highlighted circuit breaker pattern. Latency budget tips." },
  { id: 4, session: "Designing for Accessibility", speaker: "Priya Nair", tag: "design", note: "WCAG 2.2 updates. Focus management in SPAs is key." },
];

export default function App() {
  const [notes, setNotes] = useState<Note[]>(SEED_NOTES);
  const [nextId, setNextId] = useState<number>(5);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tagFilter, setTagFilter] = useState<string>("");

  const [newSession, setNewSession] = useState("");
  const [newSpeaker, setNewSpeaker] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newNote, setNewNote] = useState("");

  const [editSession, setEditSession] = useState("");
  const [editSpeaker, setEditSpeaker] = useState("");
  const [editTag, setEditTag] = useState("");
  const [editNote, setEditNote] = useState("");

  const handleAdd = () => {
    if (!newSession.trim() || !newSpeaker.trim() || !newTag.trim() || !newNote.trim()) return;
    const entry: Note = { id: nextId, session: newSession.trim(), speaker: newSpeaker.trim(), tag: newTag.trim(), note: newNote.trim() };
    setNotes([entry, ...notes]);
    setNextId(nextId + 1);
    setNewSession("");
    setNewSpeaker("");
    setNewTag("");
    setNewNote("");
  };

  const handleDelete = (id: number) => {
    if (editingId === id) setEditingId(null);
    setNotes(notes.filter((n) => n.id !== id));
  };

  const startEdit = (n: Note) => {
    setEditingId(n.id);
    setEditSession(n.session);
    setEditSpeaker(n.speaker);
    setEditTag(n.tag);
    setEditNote(n.note);
  };

  const handleSave = (id: number) => {
    setNotes(notes.map((n) => n.id === id ? { ...n, session: editSession.trim(), speaker: editSpeaker.trim(), tag: editTag.trim(), note: editNote.trim() } : n));
    setEditingId(null);
  };

  const filtered = notes.filter((n) =>
    tagFilter === "" || n.tag.toLowerCase().includes(tagFilter.toLowerCase())
  );

  return (
    <main>
      <h1>Talk Notes</h1>

      <section data-testid="add-form">
        <input
          data-testid="input-session"
          placeholder="Session"
          value={newSession}
          onChange={(e) => setNewSession(e.target.value)}
          aria-label="Session"
        />
        <input
          data-testid="input-speaker"
          placeholder="Speaker"
          value={newSpeaker}
          onChange={(e) => setNewSpeaker(e.target.value)}
          aria-label="Speaker"
        />
        <input
          data-testid="input-tag"
          placeholder="Tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          aria-label="Tag"
        />
        <textarea
          data-testid="input-note"
          placeholder="Note"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          aria-label="Note"
        />
        <button data-testid="add-btn" onClick={handleAdd}>Add Note</button>
      </section>

      <input
        data-testid="tag-filter"
        placeholder="Filter by tag"
        aria-label="Filter by tag"
        value={tagFilter}
        onChange={(e) => setTagFilter(e.target.value)}
      />

      <p data-testid="note-count">{filtered.length} notes</p>

      <ul data-testid="note-list">
        {filtered.map((n) => (
          <li key={n.id} data-testid={`note-${n.id}`}>
            {editingId === n.id ? (
              <div data-testid={`edit-form-${n.id}`}>
                <input data-testid={`edit-session-${n.id}`} aria-label="Session" value={editSession} onChange={(e) => setEditSession(e.target.value)} />
                <input data-testid={`edit-speaker-${n.id}`} aria-label="Speaker" value={editSpeaker} onChange={(e) => setEditSpeaker(e.target.value)} />
                <input data-testid={`edit-tag-${n.id}`} aria-label="Tag" value={editTag} onChange={(e) => setEditTag(e.target.value)} />
                <textarea data-testid={`edit-note-${n.id}`} aria-label="Note" value={editNote} onChange={(e) => setEditNote(e.target.value)} />
                <button data-testid={`save-btn-${n.id}`} onClick={() => handleSave(n.id)}>Save</button>
                <button data-testid={`cancel-btn-${n.id}`} onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <div data-testid={`note-view-${n.id}`}>
                <span data-testid={`note-session-${n.id}`}>{n.session}</span>
                <span data-testid={`note-speaker-${n.id}`}>{n.speaker}</span>
                <span data-testid={`note-tag-${n.id}`}>{n.tag}</span>
                <span data-testid={`note-text-${n.id}`}>{n.note}</span>
                <button data-testid={`edit-btn-${n.id}`} onClick={() => startEdit(n)}>Edit</button>
                <button data-testid={`delete-btn-${n.id}`} onClick={() => handleDelete(n.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
