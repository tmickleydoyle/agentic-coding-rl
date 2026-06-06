"use client";
import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function HistoryPage() {
  const { podcasts } = useApp();
  const played = podcasts.flatMap((p) => p.episodes.filter((e) => e.played).map((e) => ({ ...e, podcastTitle: p.title })));
  played.sort((a, b) => (b.playedAt || "").localeCompare(a.playedAt || ""));

  return (
    <div data-testid="history-page">
      <h2>Listen History</h2>
      <p data-testid="history-count">Played: {played.length}</p>
      <ul data-testid="history-list">
        {played.map((e) => (
          <li key={e.id} data-testid={`history-item-${e.id}`}>
            <span data-testid={`history-title-${e.id}`}>{e.title}</span>
            <span data-testid={`history-podcast-${e.id}`}>{e.podcastTitle}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
