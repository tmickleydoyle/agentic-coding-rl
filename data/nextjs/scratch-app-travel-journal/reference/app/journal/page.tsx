import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function JournalPage() {
  const { entries } = useApp();
  if (entries.length === 0) {
    return <div data-testid="empty-state">No entries yet</div>;
  }
  return (
    <div data-testid="journal-page">
      <h2>Journal Entries</h2>
      {entries
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((e) => (
          <div key={e.id} data-testid="entry-card">
            <span data-testid="entry-title">{e.title}</span>
            <span data-testid="entry-country">{e.country}</span>
            <span data-testid="entry-city">{e.city}</span>
            <span data-testid="entry-date">{e.date}</span>
            <span data-testid="entry-mood">{e.mood}</span>
            <span data-testid="entry-rating">{e.rating}</span>
          </div>
        ))}
    </div>
  );
}
