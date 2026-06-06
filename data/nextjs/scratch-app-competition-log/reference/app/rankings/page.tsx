import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function RankingsPage() {
  const { competitions } = useApp();
  const podiumCount: Record<string, number> = {};
  competitions.forEach((c) => {
    c.results.forEach((r) => {
      if (r.place >= 1 && r.place <= 3) {
        podiumCount[r.athleteName] = (podiumCount[r.athleteName] || 0) + 1;
      }
    });
  });
  const ranked = Object.keys(podiumCount)
    .map((name) => ({ name, count: podiumCount[name] }))
    .sort((a, b) => b.count - a.count);

  return (
    <div data-testid="rankings-page">
      <h1>Rankings</h1>
      <ul data-testid="rankings-list">
        {ranked.map((entry) => (
          <li key={entry.name} data-testid={`ranking-item-${entry.name.toLowerCase().replace(/\s/g, "-")}`}>
            <span data-testid={`ranking-name-${entry.name.toLowerCase().replace(/\s/g, "-")}`}>{entry.name}</span>
            <span data-testid={`ranking-count-${entry.name.toLowerCase().replace(/\s/g, "-")}`}>{entry.count} podiums</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
