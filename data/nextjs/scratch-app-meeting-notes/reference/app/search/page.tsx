import React, { useState } from "react";
import { Meeting } from "../../lib/types";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Meeting[]>([]);
  const [searched, setSearched] = useState(false);

  const doSearch = async () => {
    if (!query.trim()) return;
    const res = await fetch(`/api/items?q=${encodeURIComponent(query)}`);
    const d = await res.json();
    setResults(d.meetings ?? []);
    setSearched(true);
  };

  return (
    <div data-testid="search-page">
      <h1>Search Meetings</h1>
      <div data-testid="search-form">
        <input data-testid="input-search" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <button data-testid="btn-search" onClick={doSearch}>Search</button>
      </div>
      {searched && (
        <ul data-testid="search-results">
          {results.map((m) => (
            <li key={m.id} data-testid={`result-item-${m.id}`}>
              <span data-testid={`result-title-${m.id}`}>{m.title}</span>
            </li>
          ))}
          {results.length === 0 && <li data-testid="no-results">No meetings found.</li>}
        </ul>
      )}
    </div>
  );
}
