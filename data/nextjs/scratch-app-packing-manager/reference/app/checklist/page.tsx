import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function ChecklistPage() {
  const { lists } = useApp();
  const [filter, setFilter] = useState<"all" | "checked">("all");

  const allItems = lists.flatMap((l) => l.items);
  const displayed = filter === "checked" ? allItems.filter((i) => i.checked) : allItems;

  return (
    <div data-testid="checklist-page">
      <h2>Master Checklist</h2>
      <button data-testid="filter-all" onClick={() => setFilter("all")}>All</button>
      <button data-testid="filter-checked" onClick={() => setFilter("checked")}>Checked</button>
      {displayed.map((item) => (
        <div key={item.id} data-testid="checklist-item">
          <span data-testid="checklist-item-name">{item.name}</span>
          <span data-testid="checklist-item-category">{item.category}</span>
          <span data-testid="checklist-item-checked">{item.checked ? "yes" : "no"}</span>
        </div>
      ))}
    </div>
  );
}
