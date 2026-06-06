import React from "react";

export function DistributionsPage() {
  return (
    <div data-testid="distributions-page">
      <h1>Distributions</h1>
      <p data-testid="no-distributions">No distributions found.</p>
      <div data-testid="add-dist-form">
        <input data-testid="dist-trust-input" placeholder="Trust Name" />
        <input data-testid="dist-beneficiary-input" placeholder="Beneficiary" />
        <input data-testid="dist-amount-input" type="number" placeholder="Amount" />
        <input data-testid="dist-date-input" type="date" />
        <button data-testid="add-dist-btn">Add Distribution</button>
      </div>
    </div>
  );
}
