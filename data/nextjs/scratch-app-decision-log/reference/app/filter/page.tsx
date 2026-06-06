import React, { useState } from "react";
import { Decision, DecisionStatus } from "../../lib/types";

const STATUSES: DecisionStatus[] = ["pending", "decided", "revisited"];

export function FilterPage() {
  const [results, setResults] = useState<Decision[]>([]);
  const [searched, setSearched] = useState(false);

  const filter = async (s: DecisionStatus) => {
    const res = await fetch(`/api/items?status=${s}`);
    const d = await res.json();
    setResults(d.decisions ?? []);
    setSearched(true);
  };

  return (
    <div data-testid="filter-page">
      <h1>Filter by Status</h1>
      <div data-testid="status-buttons">
        {STATUSES.map((s) => (
          <button key={s} data-testid={`filter-btn-${s}`} onClick={() => filter(s)}>{s}</button>
        ))}
      </div>
      {searched && (
        <ul data-testid="filter-results">
          {results.map((d) => (
            <li key={d.id} data-testid={`filter-item-${d.id}`}>
              <span data-testid={`filter-title-${d.id}`}>{d.title}</span>
            </li>
          ))}
          {results.length === 0 && <li data-testid="no-filter-results">No decisions with this status.</li>}
        </ul>
      )}
    </div>
  );
}
