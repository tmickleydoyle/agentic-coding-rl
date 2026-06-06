"use client";
import { useState } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  summary: string;
}

const SEED_BOOKS: Book[] = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", rating: 4, summary: "A tale of wealth, obsession, and the American Dream." },
  { id: 2, title: "Sapiens", author: "Yuval Noah Harari", genre: "Non-Fiction", rating: 5, summary: "A brief history of humankind from the Stone Age to today." },
  { id: 3, title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", rating: 5, summary: "An epic story of politics, religion, and survival on a desert planet." },
];

let nextId = 4;

export default function App() {
  const [books, setBooks] = useState<Book[]>(SEED_BOOKS);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [summary, setSummary] = useState("");
  const [filter, setFilter] = useState("");

  function handleAdd() {
    const r = Number(rating);
    if (!title.trim() || !author.trim() || !genre.trim() || !summary.trim()) return;
    if (!rating.trim()) return;
    if (r < 1 || r > 5 || !Number.isInteger(r)) return;
    setBooks((prev) => [
      ...prev,
      { id: nextId++, title: title.trim(), author: author.trim(), genre: genre.trim(), rating: r, summary: summary.trim() },
    ]);
    setTitle("");
    setAuthor("");
    setGenre("");
    setRating("");
    setSummary("");
  }

  function handleDelete(id: number) {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }

  const filtered = filter.trim()
    ? books.filter((b) => b.genre.toLowerCase().includes(filter.toLowerCase()))
    : books;

  return (
    <main>
      <h1>Book Summary Log</h1>

      <section data-testid="add-form">
        <input
          data-testid="input-title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Title"
        />
        <input
          data-testid="input-author"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          aria-label="Author"
        />
        <input
          data-testid="input-genre"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          aria-label="Genre"
        />
        <input
          data-testid="input-rating"
          placeholder="Rating (1-5)"
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          aria-label="Rating"
        />
        <textarea
          data-testid="input-summary"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          aria-label="Summary"
        />
        <button data-testid="btn-add" onClick={handleAdd}>Add Book</button>
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

      <ul data-testid="book-list">
        {filtered.map((book) => (
          <li key={book.id} data-testid={`book-card-${book.id}`}>
            <span data-testid={`book-title-${book.id}`}>{book.title}</span>
            <span data-testid={`book-author-${book.id}`}>{book.author}</span>
            <span data-testid={`book-genre-${book.id}`}>{book.genre}</span>
            <span data-testid={`book-rating-${book.id}`}>Rating: {book.rating}/5</span>
            <span data-testid={`book-summary-${book.id}`}>{book.summary}</span>
            <button data-testid={`btn-delete-${book.id}`} onClick={() => handleDelete(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
