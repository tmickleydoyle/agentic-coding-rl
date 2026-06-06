import React from "react";
export function LogPage() {
  return (
    <div data-testid="log-page">
      <h1>Decision Log</h1>
      <div data-testid="decision-form">
        <input data-testid="input-title" placeholder="Title" />
        <textarea data-testid="input-context" placeholder="Context" />
        <textarea data-testid="input-options" placeholder="Options considered" />
        <textarea data-testid="input-outcome" placeholder="Outcome" />
        <select data-testid="input-status"><option value="pending">pending</option></select>
        <input data-testid="input-tags" placeholder="Tags" />
        <input data-testid="input-date" type="date" />
        <button data-testid="btn-submit">Add Decision</button>
      </div>
      <ul data-testid="decisions-list"></ul>
    </div>
  );
}
