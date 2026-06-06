"use client";
import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function PlaylistsPage() {
  const { playlists, setPlaylists, albums } = useApp();
  const [name, setName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState("");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const pl = { id: String(Date.now()), name, albumIds: [] };
    setPlaylists((prev) => [...prev, pl]);
    setName("");
  }

  function handleAddAlbum(e: React.FormEvent) {
    e.preventDefault();
    setPlaylists((prev) => prev.map((p) => {
      if (p.id !== selectedPlaylist) return p;
      if (p.albumIds.includes(selectedAlbum)) return p;
      return { ...p, albumIds: [...p.albumIds, selectedAlbum] };
    }));
    setSelectedAlbum("");
  }

  return (
    <div data-testid="playlists-page">
      <h2>Playlists</h2>
      <form data-testid="create-playlist-form" onSubmit={handleCreate}>
        <input data-testid="input-playlist-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Playlist name" required />
        <button type="submit" data-testid="btn-create-playlist">Create Playlist</button>
      </form>
      <form data-testid="add-to-playlist-form" onSubmit={handleAddAlbum}>
        <select data-testid="select-playlist" value={selectedPlaylist} onChange={(e) => setSelectedPlaylist(e.target.value)} required>
          <option value="">Select playlist</option>
          {playlists.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select data-testid="select-album" value={selectedAlbum} onChange={(e) => setSelectedAlbum(e.target.value)} required>
          <option value="">Select album</option>
          {albums.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
        <button type="submit" data-testid="btn-add-to-playlist">Add to Playlist</button>
      </form>
      <ul data-testid="playlist-list">
        {playlists.map((p) => (
          <li key={p.id} data-testid={`playlist-item-${p.id}`}>
            <span data-testid={`playlist-name-${p.id}`}>{p.name}</span>
            <span data-testid={`playlist-count-${p.id}`}>{p.albumIds.length} albums</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
