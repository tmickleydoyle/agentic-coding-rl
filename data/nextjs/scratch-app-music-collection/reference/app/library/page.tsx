"use client";
import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import type { Ownership } from "../../lib/types";

export default function LibraryPage() {
  const { albums, setAlbums } = useApp();
  const [filter, setFilter] = useState("all");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [tracks, setTracks] = useState("");

  const filtered = filter === "all" ? albums : albums.filter((a) => a.genre === filter);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/tracks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, artist, genre, year: Number(year), tracks: Number(tracks) }),
    });
    const album = await res.json();
    setAlbums((prev) => [...prev, album]);
    setTitle(""); setArtist(""); setGenre(""); setYear(""); setTracks("");
  }

  async function handleOwnership(id: string, ownership: Ownership) {
    const res = await fetch("/api/tracks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ownership }),
    });
    const updated = await res.json();
    setAlbums((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }

  async function handleRemove(id: string) {
    await fetch("/api/tracks", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setAlbums((prev) => prev.filter((a) => a.id !== id));
  }

  const genres = Array.from(new Set(albums.map((a) => a.genre)));

  return (
    <div data-testid="library-page">
      <h2>Library</h2>
      <form data-testid="add-album-form" onSubmit={handleAdd}>
        <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input data-testid="input-artist" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Artist" required />
        <input data-testid="input-genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" required />
        <input data-testid="input-year" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" required />
        <input data-testid="input-tracks" type="number" value={tracks} onChange={(e) => setTracks(e.target.value)} placeholder="Tracks" required />
        <button type="submit" data-testid="btn-add-album">Add Album</button>
      </form>
      <div data-testid="genre-filters">
        <button data-testid="filter-all" onClick={() => setFilter("all")}>All</button>
        {genres.map((g) => <button key={g} data-testid={`filter-${g.toLowerCase()}`} onClick={() => setFilter(g)}>{g}</button>)}
      </div>
      <ul data-testid="album-list">
        {filtered.map((a) => (
          <li key={a.id} data-testid={`album-item-${a.id}`}>
            <span data-testid={`album-title-${a.id}`}>{a.title}</span>
            <span data-testid={`album-artist-${a.id}`}>{a.artist}</span>
            <select data-testid={`album-ownership-select-${a.id}`} value={a.ownership} onChange={(e) => handleOwnership(a.id, e.target.value as Ownership)}>
              <option value="want">want</option>
              <option value="owned">owned</option>
              <option value="streaming">streaming</option>
            </select>
            <button data-testid={`btn-remove-${a.id}`} onClick={() => handleRemove(a.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
