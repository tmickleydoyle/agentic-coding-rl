import React, { useState } from "react";

type Subject = "Math" | "Science" | "English" | "History";

interface Note {
  id: number;
  title: string;
  subject: Subject;
  content: string;
  pinned: boolean;
}

const SEED_NOTES: Note[] = [
  { id: 1, title: "Algebra Basics", subject: "Math", content: "Variables, expressions, and equations overview.", pinned: false },
  { id: 2, title: "Cell Biology", subject: "Science", content: "Cell structure and organelle functions.", pinned: true },
  { id: 3, title: "World War II", subject: "History", content: "Timeline of major events from 1939 to 1945.", pinned: false },
  { id: 4, title: "Shakespeare Sonnets", subject: "English", content: "Analysis of sonnets 18 and 116.", pinned: false },
];

const SUBJECTS: Subject[] = ["Math", "Science", "English", "History"];

export default function App() {
  const [notes, setNotes] = useState<Note[]>(SEED_NOTES);
  const [filterSubject, setFilterSubject] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<Subject>("Math");
  const [content, setContent] = useState("");

  function getVisible(): Note[] {
    let result = notes.slice();
    if (filterSubject !== "All") {
      result = result.filter((n) => n.subject === filterSubject);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => Number(b.pinned) - Number(a.pinned));
    return result;
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const newId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
    setNotes([...notes, { id: newId, title, subject, content, pinned: false }]);
    setTitle("");
    setSubject("Math");
    setContent("");
  }

  function handlePin(id: number) {
    setNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  }

  function handleDelete(id: number) {
    setNotes(notes.filter((n) => n.id !== id));
  }

  const visible = getVisible();

  return (
    <div>
      <h1 data-testid="app-title">Student Notes</h1>

      <form data-testid="add-form" onSubmit={handleAdd}>
        <input
          data-testid="input-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
        />
        <select
          data-testid="select-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value as Subject)}
        >
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <textarea
          data-testid="input-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Note content"
        />
        <button data-testid="btn-add" type="submit">Add Note</button>
      </form>

      <input
        data-testid="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search notes..."
      />
      <button data-testid="btn-clear-search" onClick={() => setSearch("")}>Clear</button>

      <select
        data-testid="filter-subject"
        value={filterSubject}
        onChange={(e) => setFilterSubject(e.target.value)}
      >
        <option value="All">All</option>
        {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <div data-testid="note-count">{visible.length} notes</div>

      <div data-testid="notes-list">
        {visible.map((n) => (
          <div key={n.id} data-testid={`note-item-${n.id}`}>
            <span data-testid={`note-title-${n.id}`}>{n.title}</span>
            <span data-testid={`note-subject-${n.id}`}>{n.subject}</span>
            <span data-testid={`note-content-${n.id}`}>{n.content}</span>
            <button data-testid={`btn-pin-${n.id}`} onClick={() => handlePin(n.id)}>
              {n.pinned ? "Unpin" : "Pin"}
            </button>
            <button data-testid={`btn-delete-${n.id}`} onClick={() => handleDelete(n.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
