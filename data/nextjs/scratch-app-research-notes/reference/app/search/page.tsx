import React, { useState } from "react";
import { ResearchNote } from "../../lib/types";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResearchNote[]>([]);
  const [searched, setSearched] = useState(false);

  const doSearch = async () => {
    if (!query.trim()) return;
    const res = await fetch(`/api/notes?q=${encodeURIComponent(query)}`);
    const d = await res.json();
    setResults(d.notes ?? []);
    setSearched(true);
  };

  return (
    <div data-testid="search-page">
      <h1>Search Notes</h1>
      <div data-testid="search-form">
        <input data-testid="input-search" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <button data-testid="btn-search" onClick={doSearch}>Search</button>
      </div>
      {searched && (
        <ul data-testid="search-results">
          {results.map((n) => (
            <li key={n.id} data-testid={`result-item-${n.id}`}>
              <span data-testid={`result-title-${n.id}`}>{n.title}</span>
            </li>
          ))}
          {results.length === 0 && <li data-testid="no-results">No results found.</li>}
        </ul>
      )}
    </div>
  );
}
