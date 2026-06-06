"use client";
import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import type { WatchStatus } from "../../lib/types";

export default function WatchlistPage() {
  const { movies, setMovies } = useApp();
  const [filter, setFilter] = useState<WatchStatus | "all">("all");
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [runtime, setRuntime] = useState("");

  const filtered = filter === "all" ? movies : movies.filter((m) => m.status === filter);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, director, genre, year: Number(year), runtime: Number(runtime) }),
    });
    const movie = await res.json();
    setMovies((prev) => [...prev, movie]);
    setTitle(""); setDirector(""); setGenre(""); setYear(""); setRuntime("");
  }

  async function handleStatus(id: string, status: WatchStatus) {
    const res = await fetch("/api/movies", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const updated = await res.json();
    setMovies((prev) => prev.map((m) => (m.id === id ? updated : m)));
  }

  async function handleRemove(id: string) {
    await fetch("/api/movies", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setMovies((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div data-testid="watchlist-page">
      <h2>Watchlist</h2>
      <form data-testid="add-movie-form" onSubmit={handleAdd}>
        <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input data-testid="input-director" value={director} onChange={(e) => setDirector(e.target.value)} placeholder="Director" required />
        <input data-testid="input-genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" required />
        <input data-testid="input-year" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" required />
        <input data-testid="input-runtime" type="number" value={runtime} onChange={(e) => setRuntime(e.target.value)} placeholder="Runtime (min)" required />
        <button type="submit" data-testid="btn-add-movie">Add Movie</button>
      </form>
      <div data-testid="filter-controls">
        {(["all", "want-to-watch", "watching", "watched"] as const).map((s) => (
          <button key={s} data-testid={`filter-${s}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>
      <ul data-testid="movie-list">
        {filtered.map((m) => (
          <li key={m.id} data-testid={`movie-item-${m.id}`}>
            <span data-testid={`movie-title-${m.id}`}>{m.title}</span>
            <span data-testid={`movie-status-${m.id}`}>{m.status}</span>
            <select data-testid={`movie-status-select-${m.id}`} value={m.status} onChange={(e) => handleStatus(m.id, e.target.value as WatchStatus)}>
              <option value="want-to-watch">want-to-watch</option>
              <option value="watching">watching</option>
              <option value="watched">watched</option>
            </select>
            <button data-testid={`btn-remove-${m.id}`} onClick={() => handleRemove(m.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
