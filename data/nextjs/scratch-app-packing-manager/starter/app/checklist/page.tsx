import React from "react";

export default function ChecklistPage() {
  return (
    <div data-testid="checklist-page">
      <button data-testid="filter-all">All</button>
      <button data-testid="filter-checked">Checked</button>
    </div>
  );
}
