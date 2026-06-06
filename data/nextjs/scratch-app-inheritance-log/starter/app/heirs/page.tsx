import React from "react";

export function HeirsPage() {
  return (
    <div data-testid="heirs-page">
      <h1>Heirs</h1>
      <div data-testid="total-share">0% total</div>
      <p data-testid="no-heirs">No heirs found.</p>
      <div data-testid="add-heir-form">
        <input data-testid="heir-name-input" placeholder="Name" />
        <input data-testid="heir-share-input" type="number" placeholder="Share %" />
        <button data-testid="add-heir-btn">Add Heir</button>
      </div>
    </div>
  );
}
