import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { DietEntry } from "../../lib/types";

export function LogPage() {
  const { entries, handleDelete } = useApp();
  return (
    <div>
      <h1>Diet Log</h1>
      <p data-testid="entry-count">{entries.length} entries</p>
      {entries.map((entry: DietEntry) => (
        <div key={entry.id} data-testid="diet-entry">
          <span>{entry.date} — {entry.mealType}: {entry.foodName} ({entry.calories} kcal)</span>
          <button data-testid={`delete-btn-${entry.id}`} onClick={() => handleDelete(entry.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
