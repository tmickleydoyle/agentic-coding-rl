import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function TimelinePage() {
  const { injuries } = useApp();
  const sorted = [...injuries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div data-testid="timeline-page">
      <h1>Timeline</h1>
      <ul data-testid="timeline-list">
        {sorted.map((i) => (
          <li key={i.id} data-testid={`timeline-item-${i.id}`}>
            <span data-testid={`timeline-date-${i.id}`}>{i.date}</span>
            <span data-testid={`timeline-body-part-${i.id}`}>{i.bodyPart}</span>
            <span data-testid={`timeline-type-${i.id}`}>{i.type}</span>
            <span data-testid={`timeline-severity-${i.id}`}>{i.severity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
