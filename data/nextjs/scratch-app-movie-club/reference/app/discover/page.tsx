"use client";
import React from "react";
import { useApp } from "../../components/AppStateProvider";

const SUGGESTIONS = [
  { title: "Parasite", director: "Bong Joon-ho", genre: "Thriller", year: 2019, runtime: 132 },
  { title: "Interstellar", director: "Christopher Nolan", genre: "Sci-Fi", year: 2014, runtime: 169 },
  { title: "The Godfather", director: "Francis Ford Coppola", genre: "Crime", year: 1972, runtime: 175 },
  { title: "Mad Max: Fury Road", director: "George Miller", genre: "Action", year: 2015, runtime: 120 },
];

export default function DiscoverPage() {
  const { movies, setMovies } = useApp();
  const existingTitles = new Set(movies.map((m) => m.title));
  const available = SUGGESTIONS.filter((s) => !existingTitles.has(s.title));

  async function handleAdd(s: typeof SUGGESTIONS[number]) {
    const res = await fetch("/api/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    const movie = await res.json();
    setMovies((prev) => [...prev, movie]);
  }

  return (
    <div data-testid="discover-page">
      <h2>Discover Movies</h2>
      <ul data-testid="suggestion-list">
        {available.map((s) => (
          <li key={s.title} data-testid={`suggestion-${s.title.toLowerCase().replace(/[\s:]+/g, "-")}`}>
            <span data-testid="suggestion-title">{s.title}</span>
            <button data-testid={`btn-add-${s.title.toLowerCase().replace(/[\s:]+/g, "-")}`} onClick={() => handleAdd(s)}>Add to Watchlist</button>
          </li>
        ))}
      </ul>
      {available.length === 0 && <p data-testid="no-suggestions">All suggestions added!</p>}
    </div>
  );
}
