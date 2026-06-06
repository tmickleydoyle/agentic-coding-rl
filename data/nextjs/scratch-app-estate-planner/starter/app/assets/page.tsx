import React from "react";

export function AssetsPage() {
  return (
    <div data-testid="assets-page">
      <h1>Assets</h1>
      <p data-testid="no-assets">No assets found.</p>
      <div data-testid="add-asset-form">
        <input data-testid="asset-name-input" placeholder="Name" />
        <select data-testid="asset-type-select"><option>Cash</option></select>
        <input data-testid="asset-value-input" placeholder="Value" type="number" />
        <input data-testid="asset-beneficiary-input" placeholder="Beneficiary" />
        <button data-testid="add-asset-btn">Add Asset</button>
      </div>
    </div>
  );
}
