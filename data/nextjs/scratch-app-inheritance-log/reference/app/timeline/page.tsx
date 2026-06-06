import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function TimelinePage() {
  const { entries } = useApp();
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div data-testid="timeline-page">
      <h1>Timeline</h1>
      {sorted.length === 0 ? (
        <p data-testid="no-timeline">No entries found.</p>
      ) : (
        <ol data-testid="timeline-list">
          {sorted.map((e) => (
            <li key={e.id} data-testid={`timeline-item-${e.id}`}>
              <span data-testid={`timeline-date-${e.id}`}>{e.date}</span>
              <span data-testid={`timeline-heir-${e.id}`}>{e.heir}</span>
              <span data-testid={`timeline-amount-${e.id}`}>${e.amount.toLocaleString()}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
