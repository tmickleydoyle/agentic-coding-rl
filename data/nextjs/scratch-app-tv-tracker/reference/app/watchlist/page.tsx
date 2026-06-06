"use client";
import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import type { ShowStatus } from "../../lib/types";

export default function WatchlistPage() {
  const { shows, setShows } = useApp();
  const [filter, setFilter] = useState<ShowStatus | "all">("all");
  const [title, setTitle] = useState("");
  const [network, setNetwork] = useState("");
  const [genre, setGenre] = useState("");
  const [totalSeasons, setTotalSeasons] = useState("");

  const filtered = filter === "all" ? shows : shows.filter((s) => s.status === filter);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/shows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, network, genre, totalSeasons: Number(totalSeasons) }),
    });
    const show = await res.json();
    setShows((prev) => [...prev, show]);
    setTitle(""); setNetwork(""); setGenre(""); setTotalSeasons("");
  }

  async function handleStatus(id: string, status: ShowStatus) {
    const res = await fetch("/api/shows", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const updated = await res.json();
    setShows((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }

  async function handleRemove(id: string) {
    await fetch("/api/shows", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setShows((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div data-testid="watchlist-page">
      <h2>TV Watchlist</h2>
      <form data-testid="add-show-form" onSubmit={handleAdd}>
        <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input data-testid="input-network" value={network} onChange={(e) => setNetwork(e.target.value)} placeholder="Network" required />
        <input data-testid="input-genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" required />
        <input data-testid="input-total-seasons" type="number" value={totalSeasons} onChange={(e) => setTotalSeasons(e.target.value)} placeholder="Total Seasons" required />
        <button type="submit" data-testid="btn-add-show">Add Show</button>
      </form>
      <div data-testid="filter-controls">
        {(["all", "want-to-watch", "watching", "completed", "dropped"] as const).map((s) => (
          <button key={s} data-testid={`filter-${s}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>
      <ul data-testid="show-list">
        {filtered.map((s) => (
          <li key={s.id} data-testid={`show-item-${s.id}`}>
            <span data-testid={`show-title-${s.id}`}>{s.title}</span>
            <select data-testid={`show-status-select-${s.id}`} value={s.status} onChange={(e) => handleStatus(s.id, e.target.value as ShowStatus)}>
              <option value="want-to-watch">want-to-watch</option>
              <option value="watching">watching</option>
              <option value="completed">completed</option>
              <option value="dropped">dropped</option>
            </select>
            <button data-testid={`btn-remove-${s.id}`} onClick={() => handleRemove(s.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
