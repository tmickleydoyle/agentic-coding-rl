import React from "react";

export function ClausesPage() {
  return (
    <div data-testid="clauses-page">
      <h1>Will Clauses</h1>
      <p data-testid="no-clauses">No clauses yet.</p>
      <div data-testid="add-clause-form">
        <input data-testid="clause-title-input" placeholder="Title" />
        <textarea data-testid="clause-body-input" placeholder="Body" />
        <button data-testid="add-clause-btn">Add Clause</button>
      </div>
    </div>
  );
}
