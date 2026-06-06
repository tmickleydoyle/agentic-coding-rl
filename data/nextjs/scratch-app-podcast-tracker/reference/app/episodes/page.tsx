"use client";
import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function EpisodesPage() {
  const { podcasts, setPodcasts } = useApp();
  const allEpisodes = podcasts.flatMap((p) => p.episodes.map((e) => ({ ...e, podcastTitle: p.title })));

  async function handleToggle(episodeId: string, played: boolean) {
    const res = await fetch("/api/podcasts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ episodeId, played: !played }),
    });
    const updated = await res.json();
    setPodcasts((prev) => prev.map((p) => ({
      ...p,
      episodes: p.episodes.map((e) => (e.id === episodeId ? { ...e, played: updated.played, playedAt: updated.playedAt } : e)),
    })));
  }

  return (
    <div data-testid="episodes-page">
      <h2>Episodes</h2>
      <ul data-testid="episode-list">
        {allEpisodes.map((e) => (
          <li key={e.id} data-testid={`episode-item-${e.id}`}>
            <span data-testid={`episode-title-${e.id}`}>{e.title}</span>
            <span data-testid={`episode-podcast-${e.id}`}>{e.podcastTitle}</span>
            <span data-testid={`episode-played-${e.id}`}>{e.played ? "played" : "unplayed"}</span>
            <button data-testid={`btn-toggle-${e.id}`} onClick={() => handleToggle(e.id, e.played)}>
              {e.played ? "Mark Unplayed" : "Mark Played"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
