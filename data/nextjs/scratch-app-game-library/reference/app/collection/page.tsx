"use client";
import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import type { GameStatus } from "../../lib/types";

export default function CollectionPage() {
  const { games, setGames } = useApp();
  const [filter, setFilter] = useState<GameStatus | "all">("all");
  const [title, setTitle] = useState("");
  const [developer, setDeveloper] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");

  const filtered = filter === "all" ? games : games.filter((g) => g.status === filter);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, developer, genre, platform, estimatedHours: Number(estimatedHours) }),
    });
    const game = await res.json();
    setGames((prev) => [...prev, game]);
    setTitle(""); setDeveloper(""); setGenre(""); setPlatform(""); setEstimatedHours("");
  }

  async function handleStatus(id: string, status: GameStatus) {
    const res = await fetch("/api/games", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const updated = await res.json();
    setGames((prev) => prev.map((g) => (g.id === id ? updated : g)));
  }

  async function handleRemove(id: string) {
    await fetch("/api/games", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setGames((prev) => prev.filter((g) => g.id !== id));
  }

  return (
    <div data-testid="collection-page">
      <h2>Collection</h2>
      <form data-testid="add-game-form" onSubmit={handleAdd}>
        <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input data-testid="input-developer" value={developer} onChange={(e) => setDeveloper(e.target.value)} placeholder="Developer" required />
        <input data-testid="input-genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" required />
        <input data-testid="input-platform" value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="Platform" required />
        <input data-testid="input-estimated-hours" type="number" value={estimatedHours} onChange={(e) => setEstimatedHours(e.target.value)} placeholder="Est. Hours" required />
        <button type="submit" data-testid="btn-add-game">Add Game</button>
      </form>
      <div data-testid="filter-controls">
        {(["all", "wishlist", "owned", "playing", "completed", "dropped"] as const).map((s) => (
          <button key={s} data-testid={`filter-${s}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>
      <ul data-testid="game-list">
        {filtered.map((g) => (
          <li key={g.id} data-testid={`game-item-${g.id}`}>
            <span data-testid={`game-title-${g.id}`}>{g.title}</span>
            <span data-testid={`game-platform-${g.id}`}>{g.platform}</span>
            <select data-testid={`game-status-select-${g.id}`} value={g.status} onChange={(e) => handleStatus(g.id, e.target.value as GameStatus)}>
              <option value="wishlist">wishlist</option>
              <option value="owned">owned</option>
              <option value="playing">playing</option>
              <option value="completed">completed</option>
              <option value="dropped">dropped</option>
            </select>
            <button data-testid={`btn-remove-${g.id}`} onClick={() => handleRemove(g.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
