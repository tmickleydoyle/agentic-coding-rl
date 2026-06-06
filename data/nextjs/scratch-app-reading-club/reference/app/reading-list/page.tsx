"use client";
import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import type { ReadingStatus } from "../../lib/types";

export default function ReadingListPage() {
  const { books, setBooks } = useApp();
  const [filter, setFilter] = useState<ReadingStatus | "all">("all");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [pages, setPages] = useState("");

  const filtered = filter === "all" ? books : books.filter((b) => b.status === filter);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author, genre, pages: Number(pages) }),
    });
    const book = await res.json();
    setBooks((prev) => [...prev, book]);
    setTitle(""); setAuthor(""); setGenre(""); setPages("");
  }

  async function handleStatus(id: string, status: ReadingStatus) {
    const res = await fetch("/api/books", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const updated = await res.json();
    setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
  }

  async function handleRemove(id: string) {
    await fetch("/api/books", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div data-testid="reading-list-page">
      <h2>Reading List</h2>
      <form data-testid="add-book-form" onSubmit={handleAdd}>
        <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input data-testid="input-author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" required />
        <input data-testid="input-genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" required />
        <input data-testid="input-pages" type="number" value={pages} onChange={(e) => setPages(e.target.value)} placeholder="Pages" required />
        <button type="submit" data-testid="btn-add-book">Add Book</button>
      </form>
      <div data-testid="filter-controls">
        {(["all", "want-to-read", "reading", "read"] as const).map((s) => (
          <button key={s} data-testid={`filter-${s}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>
      <ul data-testid="book-list">
        {filtered.map((b) => (
          <li key={b.id} data-testid={`book-item-${b.id}`}>
            <span data-testid={`book-title-${b.id}`}>{b.title}</span>
            <span data-testid={`book-status-${b.id}`}>{b.status}</span>
            <select
              data-testid={`book-status-select-${b.id}`}
              value={b.status}
              onChange={(e) => handleStatus(b.id, e.target.value as ReadingStatus)}
            >
              <option value="want-to-read">want-to-read</option>
              <option value="reading">reading</option>
              <option value="read">read</option>
            </select>
            <button data-testid={`btn-remove-${b.id}`} onClick={() => handleRemove(b.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
