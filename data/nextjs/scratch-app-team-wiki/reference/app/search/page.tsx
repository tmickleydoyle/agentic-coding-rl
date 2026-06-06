import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function SearchPage() {
  const { pages } = useApp();
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? pages.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.content.toLowerCase().includes(query.toLowerCase())
      )
    : pages;

  function getSnippet(content: string, q: string): string {
    if (!q.trim()) return content.slice(0, 80);
    const idx = content.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return content.slice(0, 80);
    const start = Math.max(0, idx - 20);
    const end = Math.min(content.length, idx + q.length + 60);
    return (start > 0 ? "..." : "") + content.slice(start, end) + (end < content.length ? "..." : "");
  }

  return (
    <div data-testid="search-page">
      <h1>Search</h1>
      <input
        data-testid="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search pages..."
      />
      <div data-testid="search-results">
        <div data-testid="search-count">Found: {results.length}</div>
        {results.map((p) => (
          <div key={p.id} data-testid={`search-result-${p.id}`}>
            <div data-testid={`result-title-${p.id}`}>{p.title}</div>
            <div data-testid={`result-snippet-${p.id}`}>{getSnippet(p.content, query)}</div>
            <div data-testid={`result-category-${p.id}`}>{p.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
