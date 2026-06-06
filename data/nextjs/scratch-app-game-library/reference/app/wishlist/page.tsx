"use client";
import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function WishlistPage() {
  const { games, setGames } = useApp();
  const wishlist = games.filter((g) => g.status === "wishlist");

  async function handleOwn(id: string) {
    const res = await fetch("/api/games", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "owned" }),
    });
    const updated = await res.json();
    setGames((prev) => prev.map((g) => (g.id === id ? updated : g)));
  }

  return (
    <div data-testid="wishlist-page">
      <h2>Wishlist</h2>
      <p data-testid="wishlist-count">Games: {wishlist.length}</p>
      <ul data-testid="wishlist-list">
        {wishlist.map((g) => (
          <li key={g.id} data-testid={`wishlist-item-${g.id}`}>
            <span data-testid={`wishlist-title-${g.id}`}>{g.title}</span>
            <span data-testid={`wishlist-platform-${g.id}`}>{g.platform}</span>
            <button data-testid={`btn-own-${g.id}`} onClick={() => handleOwn(g.id)}>Mark Owned</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
