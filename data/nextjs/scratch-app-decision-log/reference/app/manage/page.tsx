import React, { useState, useEffect } from "react";
import { Decision } from "../../lib/types";

export function ArchivePage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);

  useEffect(() => {
    fetch("/api/items?status=decided")
      .then((r) => r.json())
      .then((d) => setDecisions(d.decisions ?? []));
  }, []);

  return (
    <div data-testid="archive-page">
      <h1>Decided Decisions</h1>
      <ul data-testid="archive-list">
        {decisions.map((d) => (
          <li key={d.id} data-testid={`archive-item-${d.id}`}>
            <span data-testid={`archive-title-${d.id}`}>{d.title}</span>
            <span data-testid={`archive-outcome-${d.id}`}>{d.outcome}</span>
          </li>
        ))}
      </ul>
      {decisions.length === 0 && <p data-testid="no-archive">No decided decisions yet.</p>}
    </div>
  );
}
