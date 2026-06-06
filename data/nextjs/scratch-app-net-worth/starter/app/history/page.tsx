import React from "react";
export function HistoryPage() {
  return (
    <div data-testid="history-page">
      <div data-testid="snapshot-form">
        <input data-testid="snapshot-date" type="date" />
        <span data-testid="snapshot-preview">$0.00</span>
        <button data-testid="add-snapshot-btn">Save Snapshot</button>
      </div>
      <ul data-testid="snapshot-list"></ul>
    </div>
  );
}
