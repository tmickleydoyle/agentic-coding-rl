import React from "react";

export function ValuationsPage() {
  return (
    <div data-testid="valuations-page">
      <h1>Valuations</h1>
      <p data-testid="no-valuations">No valuations found.</p>
      <div data-testid="add-val-form">
        <input data-testid="val-asset-input" placeholder="Asset Name" />
        <input data-testid="val-value-input" type="number" placeholder="Value" />
        <input data-testid="val-date-input" type="date" />
        <button data-testid="add-val-btn">Add Valuation</button>
      </div>
    </div>
  );
}
