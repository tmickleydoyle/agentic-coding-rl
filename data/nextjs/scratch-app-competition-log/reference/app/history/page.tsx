import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function HistoryPage() {
  const { competitions } = useApp();
  return (
    <div data-testid="history-page">
      <h1>History</h1>
      {competitions.map((c) => (
        <div key={c.id} data-testid={`history-comp-${c.id}`}>
          <strong data-testid={`history-comp-name-${c.id}`}>{c.name}</strong>
          <span data-testid={`history-comp-date-${c.id}`}> — {c.date}</span>
          <ul>
            {c.results.map((r) => (
              <li key={r.id} data-testid={`history-result-${r.id}`}>
                {r.place}. {r.athleteName} — {r.score}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
