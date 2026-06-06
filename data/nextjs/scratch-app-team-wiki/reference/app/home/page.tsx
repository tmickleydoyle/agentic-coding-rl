import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function HomePage() {
  const { pages } = useApp();
  const sorted = [...pages].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const recent = sorted.slice(0, 3);

  return (
    <div data-testid="home-page">
      <h1>Team Wiki</h1>
      <div data-testid="total-pages">Total Pages: {pages.length}</div>
      <section data-testid="recent-pages">
        <h2>Recent Pages</h2>
        {recent.map((p) => (
          <div key={p.id} data-testid={`recent-page-${p.id}`}>
            <div data-testid={`recent-title-${p.id}`}>{p.title}</div>
            <div data-testid={`recent-category-${p.id}`}>{p.category}</div>
            <div data-testid={`recent-date-${p.id}`}>{p.createdAt}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
