import React, { useState, useEffect } from "react";
import { ResearchNote } from "../../lib/types";

export function SourcesPage() {
  const [notes, setNotes] = useState<ResearchNote[]>([]);

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((d) => setNotes(d.notes ?? []));
  }, []);

  const withSource = notes.filter((n) => n.sourceUrl.trim() !== "");

  return (
    <div data-testid="sources-page">
      <h1>Sources</h1>
      <ul data-testid="sources-list">
        {withSource.map((n) => (
          <li key={n.id} data-testid={`source-item-${n.id}`}>
            <span data-testid={`source-title-${n.id}`}>{n.title}</span>
            <a data-testid={`source-url-${n.id}`} href={n.sourceUrl} target="_blank" rel="noreferrer">{n.sourceUrl}</a>
          </li>
        ))}
      </ul>
      {withSource.length === 0 && <p data-testid="no-sources">No sources yet.</p>}
    </div>
  );
}
