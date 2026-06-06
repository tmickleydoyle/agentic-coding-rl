"use client";
import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function StatsPage() {
  const { books } = useApp();
  const readBooks = books.filter((b) => b.status === "read");
  const totalPages = readBooks.reduce((sum, b) => sum + b.pages, 0);

  const genreCounts: Record<string, number> = {};
  readBooks.forEach((b) => {
    genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
  });
  const favoriteGenre = Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a])[0] || "N/A";

  return (
    <div data-testid="stats-page">
      <h2>Reading Stats</h2>
      <p data-testid="stat-total-books">Total books: {books.length}</p>
      <p data-testid="stat-books-read">Books read: {readBooks.length}</p>
      <p data-testid="stat-total-pages">Total pages read: {totalPages}</p>
      <p data-testid="stat-favorite-genre">Favorite genre: {favoriteGenre}</p>
      <ul data-testid="genre-breakdown">
        {Object.keys(genreCounts).map((g) => (
          <li key={g} data-testid={`genre-${g.toLowerCase().replace(/\s+/g, "-")}`}>
            {g}: {genreCounts[g]}
          </li>
        ))}
      </ul>
    </div>
  );
}
