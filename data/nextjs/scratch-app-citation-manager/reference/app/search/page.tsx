import React, { useState } from "react";
import { Citation } from "../../lib/types";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Citation[]>([]);
  const [searched, setSearched] = useState(false);

  const doSearch = async () => {
    if (!query.trim()) return;
    const res = await fetch(`/api/citations?q=${encodeURIComponent(query)}`);
    const d = await res.json();
    setResults(d.citations ?? []);
    setSearched(true);
  };

  return (
    <div data-testid="search-page">
      <h1>Search Citations</h1>
      <div data-testid="search-form">
        <input data-testid="input-search" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <button data-testid="btn-search" onClick={doSearch}>Search</button>
      </div>
      {searched && (
        <ul data-testid="search-results">
          {results.map((c) => (
            <li key={c.id} data-testid={`result-item-${c.id}`}>
              <span data-testid={`result-title-${c.id}`}>{c.title}</span>
            </li>
          ))}
          {results.length === 0 && <li data-testid="no-results">No results.</li>}
        </ul>
      )}
    </div>
  );
}
