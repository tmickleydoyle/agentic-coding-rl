"use client";
import { useState } from "react";

interface Author {
  id: number;
  name: string;
  genre: string;
  booksRead: number;
  rating: number;
}

const SEED_AUTHORS: Author[] = [
  { id: 1, name: "Ursula K. Le Guin", genre: "Sci-Fi/Fantasy", booksRead: 7, rating: 5 },
  { id: 2, name: "Haruki Murakami", genre: "Literary Fiction", booksRead: 4, rating: 4 },
  { id: 3, name: "Agatha Christie", genre: "Mystery", booksRead: 12, rating: 5 },
];

let nextId = 4;

export default function App() {
  const [authors, setAuthors] = useState<Author[]>(SEED_AUTHORS);
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [booksRead, setBooksRead] = useState("");
  const [rating, setRating] = useState("");
  const [filter, setFilter] = useState("");

  function handleAdd() {
    const br = Number(booksRead);
    const r = Number(rating);
    if (!name.trim() || !genre.trim()) return;
    if (!booksRead.trim() || !rating.trim()) return;
    if (!Number.isInteger(br) || br < 0) return;
    if (!Number.isInteger(r) || r < 1 || r > 5) return;
    setAuthors((prev) => [...prev, { id: nextId++, name: name.trim(), genre: genre.trim(), booksRead: br, rating: r }]);
    setName("");
    setGenre("");
    setBooksRead("");
    setRating("");
  }

  function handleDelete(id: number) {
    setAuthors((prev) => prev.filter((a) => a.id !== id));
  }

  function handleIncrement(id: number) {
    setAuthors((prev) => prev.map((a) => a.id === id ? { ...a, booksRead: a.booksRead + 1 } : a));
  }

  const filtered = filter.trim()
    ? authors.filter((a) => a.genre.toLowerCase().includes(filter.toLowerCase()))
    : authors;

  const totalAuthors = authors.length;
  const totalBooks = authors.reduce((sum, a) => sum + a.booksRead, 0);

  return (
    <main>
      <h1>Author Tracker</h1>

      <section data-testid="stats">
        <span data-testid="stat-total-authors">Total Authors: {totalAuthors}</span>
        <span data-testid="stat-total-books">Total Books Read: {totalBooks}</span>
      </section>

      <section data-testid="add-form">
        <input
          data-testid="input-name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Name"
        />
        <input
          data-testid="input-genre"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          aria-label="Genre"
        />
        <input
          data-testid="input-books-read"
          placeholder="Books Read"
          type="number"
          value={booksRead}
          onChange={(e) => setBooksRead(e.target.value)}
          aria-label="Books Read"
        />
        <input
          data-testid="input-rating"
          placeholder="Rating (1-5)"
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          aria-label="Rating"
        />
        <button data-testid="btn-add" onClick={handleAdd}>Add Author</button>
      </section>

      <section data-testid="filter-section">
        <input
          data-testid="filter-genre"
          placeholder="Filter by genre"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter by genre"
        />
      </section>

      <ul data-testid="author-list">
        {filtered.map((a) => (
          <li key={a.id} data-testid={`author-card-${a.id}`}>
            <span data-testid={`author-name-${a.id}`}>{a.name}</span>
            <span data-testid={`author-genre-${a.id}`}>{a.genre}</span>
            <span data-testid={`author-books-${a.id}`}>Books Read: {a.booksRead}</span>
            <span data-testid={`author-rating-${a.id}`}>Rating: {a.rating}/5</span>
            <button data-testid={`btn-increment-${a.id}`} onClick={() => handleIncrement(a.id)}>+1 Book</button>
            <button data-testid={`btn-delete-${a.id}`} onClick={() => handleDelete(a.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
