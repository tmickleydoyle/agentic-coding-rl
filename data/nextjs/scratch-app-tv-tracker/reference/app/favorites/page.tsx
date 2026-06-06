"use client";
import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function FavoritesPage() {
  const { shows, setShows } = useApp();
  const favorites = shows.filter((s) => s.favorite);

  async function handleUnfavorite(id: string) {
    const res = await fetch("/api/shows", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, favorite: false }),
    });
    const updated = await res.json();
    setShows((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }

  async function handleFavorite(id: string) {
    const res = await fetch("/api/shows", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, favorite: true }),
    });
    const updated = await res.json();
    setShows((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }

  return (
    <div data-testid="favorites-page">
      <h2>Favorites</h2>
      <p data-testid="favorites-count">Favorites: {favorites.length}</p>
      <ul data-testid="favorites-list">
        {favorites.map((s) => (
          <li key={s.id} data-testid={`favorite-item-${s.id}`}>
            <span data-testid={`favorite-title-${s.id}`}>{s.title}</span>
            <button data-testid={`btn-unfavorite-${s.id}`} onClick={() => handleUnfavorite(s.id)}>Remove Favorite</button>
          </li>
        ))}
      </ul>
      <h3>Add to Favorites</h3>
      <ul data-testid="non-favorites-list">
        {shows.filter((s) => !s.favorite).map((s) => (
          <li key={s.id} data-testid={`non-favorite-item-${s.id}`}>
            <span>{s.title}</span>
            <button data-testid={`btn-favorite-${s.id}`} onClick={() => handleFavorite(s.id)}>Favorite</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
