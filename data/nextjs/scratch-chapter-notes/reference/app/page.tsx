"use client";
import { useState } from "react";

interface Note {
  id: number;
  book: string;
  chapter: number;
  text: string;
}

const BOOKS = ["Moby Dick", "1984", "To Kill a Mockingbird"];

const SEED_NOTES: Note[] = [
  { id: 1, book: "Moby Dick", chapter: 1, text: "Ishmael introduces himself and his desire to go to sea." },
  { id: 2, book: "1984", chapter: 1, text: "Winston Smith writes in his diary for the first time." },
];

let nextId = 3;

export default function App() {
  const [notes, setNotes] = useState<Note[]>(SEED_NOTES);
  const [book, setBook] = useState(BOOKS[0]);
  const [chapter, setChapter] = useState("");
  const [text, setText] = useState("");
  const [filterBook, setFilterBook] = useState("All");

  function handleAdd() {
    const ch = Number(chapter);
    if (!chapter.trim() || !text.trim()) return;
    if (!Number.isInteger(ch) || ch < 1) return;
    setNotes((prev) => [...prev, { id: nextId++, book, chapter: ch, text: text.trim() }]);
    setBook(BOOKS[0]);
    setChapter("");
    setText("");
  }

  function handleDelete(id: number) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  const filtered = filterBook === "All" ? notes : notes.filter((n) => n.book === filterBook);

  return (
    <main>
      <h1>Chapter Notes</h1>

      <section data-testid="add-form">
        <select
          data-testid="select-book"
          value={book}
          onChange={(e) => setBook(e.target.value)}
          aria-label="Book"
        >
          {BOOKS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <input
          data-testid="input-chapter"
          placeholder="Chapter"
          type="number"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          aria-label="Chapter"
        />
        <textarea
          data-testid="input-note"
          placeholder="Note"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Note"
        />
        <button data-testid="btn-add" onClick={handleAdd}>Add Note</button>
      </section>

      <section data-testid="filter-section">
        <select
          data-testid="filter-book"
          value={filterBook}
          onChange={(e) => setFilterBook(e.target.value)}
          aria-label="Filter by book"
        >
          <option value="All">All</option>
          {BOOKS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </section>

      <ul data-testid="note-list">
        {filtered.map((note) => (
          <li key={note.id} data-testid={`note-card-${note.id}`}>
            <span data-testid={`note-book-${note.id}`}>{note.book}</span>
            <span data-testid={`note-chapter-${note.id}`}>Chapter {note.chapter}</span>
            <span data-testid={`note-text-${note.id}`}>{note.text}</span>
            <button data-testid={`btn-delete-${note.id}`} onClick={() => handleDelete(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
