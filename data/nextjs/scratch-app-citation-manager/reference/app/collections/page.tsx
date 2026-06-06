import React, { useState, useEffect } from "react";
import { Citation } from "../../lib/types";

export function CollectionsPage() {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/citations").then((r) => r.json()).then((d) => setCitations(d.citations ?? []));
  }, []);

  const collectionMap: Record<string, Citation[]> = {};
  citations.forEach((c) => {
    const col = c.collection || "Uncategorized";
    if (!collectionMap[col]) collectionMap[col] = [];
    collectionMap[col].push(c);
  });
  const allCols = Object.keys(collectionMap).sort();

  return (
    <div data-testid="collections-page">
      <h1>Collections</h1>
      <ul data-testid="collections-list">
        {allCols.map((col) => (
          <li key={col} data-testid={`collection-item-${col}`}>
            <button data-testid={`collection-btn-${col}`} onClick={() => setSelected(selected === col ? null : col)}>
              {col} ({collectionMap[col].length})
            </button>
          </li>
        ))}
      </ul>
      {selected && collectionMap[selected] && (
        <div data-testid="collection-citations">
          <h2 data-testid="collection-selected">{selected}</h2>
          <ul data-testid="collection-citations-list">
            {collectionMap[selected].map((c) => (
              <li key={c.id} data-testid={`col-citation-${c.id}`}>{c.title}</li>
            ))}
          </ul>
        </div>
      )}
      {allCols.length === 0 && <p data-testid="no-collections">No collections yet.</p>}
    </div>
  );
}
