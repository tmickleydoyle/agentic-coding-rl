"use client";
import React, { useEffect, useState } from "react";

export function OverviewPage() {
  const [stats, setStats] = useState<{ total: number; uniqueSessions: number; top3: string[] } | null>(null);

  useEffect(() => {
    fetch("/api/events/overview").then((r) => r.json()).then((d) => setStats(d));
  }, []);

  return (
    <div data-testid="overview-page">
      <h1>Overview</h1>
      <div data-testid="total-events">{stats?.total ?? 0}</div>
      <div data-testid="unique-sessions">{stats?.uniqueSessions ?? 0}</div>
      <ul data-testid="top-events">
        {(stats?.top3 ?? []).map((name) => (
          <li key={name} data-testid={`top-event-${name}`}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
