"use client";
import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function ProgressPage() {
  const { shows, setShows } = useApp();

  async function handleProgress(id: string, field: "currentSeason" | "currentEpisode", value: number) {
    const res = await fetch("/api/shows", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: value }),
    });
    const updated = await res.json();
    setShows((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }

  return (
    <div data-testid="progress-page">
      <h2>Episode Progress</h2>
      <ul data-testid="progress-list">
        {shows.map((s) => (
          <li key={s.id} data-testid={`progress-item-${s.id}`}>
            <span data-testid={`progress-title-${s.id}`}>{s.title}</span>
            <span data-testid={`progress-season-${s.id}`}>S{s.currentSeason}</span>
            <span data-testid={`progress-episode-${s.id}`}>E{s.currentEpisode}</span>
            <button data-testid={`btn-next-episode-${s.id}`} onClick={() => handleProgress(s.id, "currentEpisode", s.currentEpisode + 1)}>Next Episode</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
