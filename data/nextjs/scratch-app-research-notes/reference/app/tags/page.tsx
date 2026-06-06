import React, { useState, useEffect } from "react";
import { ResearchNote } from "../../lib/types";

export function TagsPage() {
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((d) => setNotes(d.notes ?? []));
  }, []);

  const tagMap: Record<string, ResearchNote[]> = {};
  notes.forEach((n) => {
    n.tags.forEach((t) => {
      if (!tagMap[t]) tagMap[t] = [];
      tagMap[t].push(n);
    });
  });
  const allTags = Object.keys(tagMap).sort();

  return (
    <div data-testid="tags-page">
      <h1>Tags</h1>
      <ul data-testid="tags-list">
        {allTags.map((t) => (
          <li key={t} data-testid={`tag-item-${t}`}>
            <button data-testid={`tag-btn-${t}`} onClick={() => setSelected(selected === t ? null : t)}>
              {t} ({tagMap[t].length})
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <div data-testid="tag-notes">
          <h2 data-testid="tag-selected">{selected}</h2>
          <ul data-testid="tag-notes-list">
            {tagMap[selected].map((n) => (
              <li key={n.id} data-testid={`tag-note-${n.id}`}>{n.title}</li>
            ))}
          </ul>
        </div>
      )}
      {allTags.length === 0 && <p data-testid="no-tags">No tags yet.</p>}
    </div>
  );
}
