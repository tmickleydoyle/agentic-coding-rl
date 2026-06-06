"use client";
import React from "react";
import { useApp } from "../../components/AppStateProvider";

const SUGGESTIONS = [
  { title: "1984", author: "George Orwell", genre: "Dystopia", pages: 328 },
  { title: "Sapiens", author: "Yuval Noah Harari", genre: "History", pages: 443 },
  { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", pages: 310 },
  { title: "Atomic Habits", author: "James Clear", genre: "Self-Help", pages: 319 },
  { title: "Project Hail Mary", author: "Andy Weir", genre: "Sci-Fi", pages: 476 },
];

export default function DiscoverPage() {
  const { books, setBooks } = useApp();
  const existingTitles = new Set(books.map((b) => b.title));
  const available = SUGGESTIONS.filter((s) => !existingTitles.has(s.title));

  async function handleAdd(s: typeof SUGGESTIONS[number]) {
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    const book = await res.json();
    setBooks((prev) => [...prev, book]);
  }

  return (
    <div data-testid="discover-page">
      <h2>Discover Books</h2>
      <ul data-testid="suggestion-list">
        {available.map((s) => (
          <li key={s.title} data-testid={`suggestion-${s.title.toLowerCase().replace(/\s+/g, "-")}`}>
            <span data-testid="suggestion-title">{s.title}</span>
            <span data-testid="suggestion-author"> by {s.author}</span>
            <button
              data-testid={`btn-add-suggestion-${s.title.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => handleAdd(s)}
            >
              Add to List
            </button>
          </li>
        ))}
      </ul>
      {available.length === 0 && (
        <p data-testid="no-suggestions">You have all suggestions in your list!</p>
      )}
    </div>
  );
}
