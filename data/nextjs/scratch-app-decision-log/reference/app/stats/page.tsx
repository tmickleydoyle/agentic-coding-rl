import React, { useState, useEffect } from "react";

export function StatsPage() {
  const [stats, setStats] = useState<Record<string, number>>({ pending: 0, decided: 0, revisited: 0 });

  useEffect(() => {
    fetch("/api/items?stats=1").then((r) => r.json()).then((d) => {
      if (d.stats) setStats(d.stats);
    });
  }, []);

  return (
    <div data-testid="stats-page">
      <h1>Decision Statistics</h1>
      <ul data-testid="stats-list">
        <li data-testid="stat-pending">Pending: <span data-testid="stat-pending-count">{stats.pending}</span></li>
        <li data-testid="stat-decided">Decided: <span data-testid="stat-decided-count">{stats.decided}</span></li>
        <li data-testid="stat-revisited">Revisited: <span data-testid="stat-revisited-count">{stats.revisited}</span></li>
      </ul>
      <p data-testid="stat-total">Total: {stats.pending + stats.decided + stats.revisited}</p>
    </div>
  );
}
