import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { WaterEntry } from "../../lib/types";

export function HistoryPage() {
  const { entries, handleDelete } = useApp();
  const dateMap: Record<string, WaterEntry[]> = {};
  entries.forEach((e: WaterEntry) => {
    if (!dateMap[e.date]) dateMap[e.date] = [];
    dateMap[e.date].push(e);
  });
  const dates = Object.keys(dateMap).sort().reverse();
  return (
    <div>
      <h1>Water History</h1>
      {dates.map((date) => (
        <div key={date} data-testid="history-date-group">
          <h2>{date}</h2>
          {dateMap[date].map((entry: WaterEntry) => (
            <div key={entry.id} data-testid="water-entry">
              {entry.time} — {entry.cups} cups {entry.note && `(${entry.note})`}
              <button data-testid={`delete-entry-${entry.id}`} onClick={() => handleDelete(entry.id)}>Delete</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
