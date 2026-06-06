import React, { useState, useEffect } from "react";
import { MindMapNode } from "../../lib/types";

const COLORS = ["blue", "red", "green", "yellow", "purple"];

export function FilterPage() {
  const [selected, setSelected] = useState("");
  const [results, setResults] = useState<MindMapNode[]>([]);
  const [searched, setSearched] = useState(false);

  const filter = async (c: string) => {
    setSelected(c);
    const res = await fetch(`/api/items?color=${encodeURIComponent(c)}`);
    const d = await res.json();
    setResults(d.nodes ?? []);
    setSearched(true);
  };

  return (
    <div data-testid="filter-page">
      <h1>Filter by Color</h1>
      <div data-testid="color-buttons">
        {COLORS.map((c) => (
          <button key={c} data-testid={`filter-btn-${c}`} onClick={() => filter(c)}>{c}</button>
        ))}
      </div>
      {searched && (
        <ul data-testid="filter-results">
          {results.map((n) => (
            <li key={n.id} data-testid={`filter-item-${n.id}`}>
              <span data-testid={`filter-label-${n.id}`}>{n.label}</span>
            </li>
          ))}
          {results.length === 0 && <li data-testid="no-filter-results">No nodes with this color.</li>}
        </ul>
      )}
    </div>
  );
}
