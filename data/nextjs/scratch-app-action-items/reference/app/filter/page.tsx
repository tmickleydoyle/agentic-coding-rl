import React, { useState } from "react";
import { ActionItem, Priority } from "../../lib/types";

const PRIORITIES: Priority[] = ["low", "medium", "high"];

export function FilterPage() {
  const [results, setResults] = useState<ActionItem[]>([]);
  const [searched, setSearched] = useState(false);

  const filter = async (p: Priority) => {
    const res = await fetch(`/api/items?priority=${p}`);
    const d = await res.json();
    setResults(d.items ?? []);
    setSearched(true);
  };

  return (
    <div data-testid="filter-page">
      <h1>Filter by Priority</h1>
      <div data-testid="priority-buttons">
        {PRIORITIES.map((p) => (
          <button key={p} data-testid={`filter-btn-${p}`} onClick={() => filter(p)}>{p}</button>
        ))}
      </div>
      {searched && (
        <ul data-testid="filter-results">
          {results.map((item) => (
            <li key={item.id} data-testid={`filter-item-${item.id}`}>
              <span data-testid={`filter-title-${item.id}`}>{item.title}</span>
            </li>
          ))}
          {results.length === 0 && <li data-testid="no-filter-results">No items.</li>}
        </ul>
      )}
    </div>
  );
}
