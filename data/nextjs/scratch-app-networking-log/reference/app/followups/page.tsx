import React, { useState } from "react";
import { getFollowUps, toggleFollowUp } from "../../lib/store";

type FilterType = "all" | "pending" | "done";

export function FollowupsPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [, forceUpdate] = useState(0);

  const followUps = getFollowUps();
  const filtered = followUps.filter((f) => {
    if (filter === "pending") return !f.done;
    if (filter === "done") return f.done;
    return true;
  });

  const handleToggle = (id: string) => {
    toggleFollowUp(id);
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="followups-page">
      <h2>Follow-ups</h2>
      <div>
        <button data-testid="filter-all" onClick={() => setFilter("all")}>All</button>
        <button data-testid="filter-pending" onClick={() => setFilter("pending")}>Pending</button>
        <button data-testid="filter-done" onClick={() => setFilter("done")}>Done</button>
      </div>
      {filtered.map((f) => (
        <div key={f.id} data-testid="followup-item">
          <span data-testid="followup-action">{f.action}</span>
          <span data-testid="followup-connection">{f.connectionName}</span>
          <input
            type="checkbox"
            data-testid="followup-done"
            checked={f.done}
            onChange={() => handleToggle(f.id)}
          />
        </div>
      ))}
    </div>
  );
}
