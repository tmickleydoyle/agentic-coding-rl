import React, { useState, useEffect } from "react";
import { ActionItem } from "../../lib/types";

export function CompletedPage() {
  const [items, setItems] = useState<ActionItem[]>([]);

  useEffect(() => {
    fetch("/api/items?completed=1").then((r) => r.json()).then((d) => setItems(d.items ?? []));
  }, []);

  return (
    <div data-testid="completed-page">
      <h1>Completed Items</h1>
      <ul data-testid="completed-list">
        {items.map((item) => (
          <li key={item.id} data-testid={`completed-item-${item.id}`}>
            <span data-testid={`completed-title-${item.id}`}>{item.title}</span>
            <span data-testid={`completed-assignee-${item.id}`}>{item.assignee}</span>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p data-testid="no-completed">No completed items.</p>}
    </div>
  );
}
