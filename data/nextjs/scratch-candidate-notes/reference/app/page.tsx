import React, { useState } from "react";

interface Note {
  id: number;
  candidate: string;
  tag: string;
  text: string;
}

const SEED: Note[] = [
  { id: 1, candidate: "Alice Mercer", tag: "Policy", text: "Supports renewable energy expansion" },
  { id: 2, candidate: "Bob Harrington", tag: "Background", text: "Former city council member for 8 years" },
  { id: 3, candidate: "Alice Mercer", tag: "Fundraising", text: "Q1 fundraising total: $220,000" },
  { id: 4, candidate: "Carol Nguyen", tag: "Policy", text: "Advocates for affordable housing reform" },
  { id: 5, candidate: "Bob Harrington", tag: "Policy", text: "Opposes new property tax measures" },
];

export default function App() {
  const [notes, setNotes] = useState<Note[]>(SEED.map((n) => ({ ...n })));
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("All Tags");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCandidate, setEditCandidate] = useState("");
  const [editTag, setEditTag] = useState("");
  const [editText, setEditText] = useState("");
  const [addCandidate, setAddCandidate] = useState("");
  const [addTag, setAddTag] = useState("");
  const [addNote, setAddNote] = useState("");
  const [nextId, setNextId] = useState(6);

  const allTags = Array.from(new Set(notes.map((n) => n.tag)));

  const filtered = notes.filter((n) => {
    const matchSearch =
      search === "" ||
      n.text.toLowerCase().includes(search.toLowerCase()) ||
      n.candidate.toLowerCase().includes(search.toLowerCase());
    const matchTag = tagFilter === "All Tags" || n.tag === tagFilter;
    return matchSearch && matchTag;
  });

  function startEdit(n: Note) {
    setEditingId(n.id);
    setEditCandidate(n.candidate);
    setEditTag(n.tag);
    setEditText(n.text);
  }

  function handleSave(id: number) {
    if (!editCandidate.trim() || !editTag.trim() || !editText.trim()) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, candidate: editCandidate.trim(), tag: editTag.trim(), text: editText.trim() }
          : n
      )
    );
    setEditingId(null);
  }

  function handleDelete(id: number) {
    if (editingId === id) setEditingId(null);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function handleAdd() {
    if (!addCandidate.trim() || !addTag.trim() || !addNote.trim()) return;
    setNotes((prev) => [
      ...prev,
      { id: nextId, candidate: addCandidate.trim(), tag: addTag.trim(), text: addNote.trim() },
    ]);
    setNextId((n) => n + 1);
    setAddCandidate("");
    setAddTag("");
    setAddNote("");
  }

  return (
    <div>
      <h1>Candidate Notes</h1>

      <div>
        <input
          type="text"
          data-testid="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes"
        />
        <select
          data-testid="tag-filter"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        >
          <option value="All Tags">All Tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        {filtered.map((n) => (
          <div key={n.id} data-testid="note-card">
            {editingId === n.id ? (
              <div>
                <input
                  data-testid="edit-candidate-input"
                  value={editCandidate}
                  onChange={(e) => setEditCandidate(e.target.value)}
                />
                <input
                  data-testid="edit-tag-input"
                  value={editTag}
                  onChange={(e) => setEditTag(e.target.value)}
                />
                <textarea
                  data-testid="edit-note-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button data-testid="save-btn" onClick={() => handleSave(n.id)}>Save</button>
                <button data-testid="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <span data-testid="note-candidate">{n.candidate}</span>
                <span data-testid="note-tag">{n.tag}</span>
                <span data-testid="note-text">{n.text}</span>
                <button data-testid="edit-btn" onClick={() => startEdit(n)}>Edit</button>
                <button data-testid="delete-btn" onClick={() => handleDelete(n.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div>No notes found.</div>}
      </div>

      <div>
        <input
          type="text"
          data-testid="add-candidate-input"
          value={addCandidate}
          onChange={(e) => setAddCandidate(e.target.value)}
          placeholder="Candidate name"
        />
        <input
          type="text"
          data-testid="add-tag-input"
          value={addTag}
          onChange={(e) => setAddTag(e.target.value)}
          placeholder="Tag"
        />
        <textarea
          data-testid="add-note-textarea"
          value={addNote}
          onChange={(e) => setAddNote(e.target.value)}
          placeholder="Note text"
        />
        <button data-testid="add-note-btn" onClick={handleAdd}>Add Note</button>
      </div>
    </div>
  );
}
