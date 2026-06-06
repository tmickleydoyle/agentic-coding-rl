import React from "react";

export function AllocationsPage() {
  return (
    <div data-testid="allocations-page">
      <h1>Allocations</h1>
      <p data-testid="no-allocations">No allocations found.</p>
      <div data-testid="add-alloc-form">
        <input data-testid="alloc-beneficiary-input" placeholder="Beneficiary" />
        <input data-testid="alloc-asset-input" placeholder="Asset" />
        <input data-testid="alloc-pct-input" type="number" placeholder="%" />
        <button data-testid="add-alloc-btn">Add Allocation</button>
      </div>
    </div>
  );
}
