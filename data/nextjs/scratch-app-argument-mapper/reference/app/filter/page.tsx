import React, { useState, useEffect } from "react";
import { Argument, ArgumentType } from "../../lib/types";

const TYPES: ArgumentType[] = ["claim", "support", "rebuttal", "evidence"];

export function FilterPage() {
  const [filterType, setFilterType] = useState<ArgumentType | "">("");
  const [results, setResults] = useState<Argument[]>([]);
  const [searched, setSearched] = useState(false);

  const filter = async (t: ArgumentType) => {
    setFilterType(t);
    const res = await fetch(`/api/items?type=${t}`);
    const d = await res.json();
    setResults(d.arguments ?? []);
    setSearched(true);
  };

  return (
    <div data-testid="filter-page">
      <h1>Filter Arguments</h1>
      <div data-testid="type-buttons">
        {TYPES.map((t) => (
          <button key={t} data-testid={`filter-btn-${t}`} onClick={() => filter(t)}>{t}</button>
        ))}
      </div>
      {searched && (
        <ul data-testid="filter-results">
          {results.map((a) => (
            <li key={a.id} data-testid={`filter-item-${a.id}`}>
              <span data-testid={`filter-text-${a.id}`}>{a.text}</span>
            </li>
          ))}
          {results.length === 0 && <li data-testid="no-filter-results">No arguments of this type.</li>}
        </ul>
      )}
    </div>
  );
}
