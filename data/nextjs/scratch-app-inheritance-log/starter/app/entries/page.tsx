import React from "react";

export function EntriesPage() {
  return (
    <div data-testid="entries-page">
      <h1>Inheritance Entries</h1>
      <p data-testid="no-entries">No entries found.</p>
      <div data-testid="add-entry-form">
        <input data-testid="entry-heir-input" placeholder="Heir" />
        <input data-testid="entry-amount-input" type="number" placeholder="Amount" />
        <input data-testid="entry-date-input" type="date" />
        <select data-testid="entry-status-select"><option>Pending</option></select>
        <button data-testid="add-entry-btn">Add Entry</button>
      </div>
    </div>
  );
}
