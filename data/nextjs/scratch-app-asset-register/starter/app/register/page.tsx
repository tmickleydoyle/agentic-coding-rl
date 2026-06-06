import React from "react";

export function RegisterPage() {
  return (
    <div data-testid="register-page">
      <h1>Asset Register</h1>
      <p data-testid="no-assets">No assets found.</p>
      <div data-testid="add-asset-form">
        <input data-testid="asset-name-input" placeholder="Name" />
        <select data-testid="asset-category-select"><option>Other</option></select>
        <input data-testid="asset-acquired-input" type="date" />
        <button data-testid="add-asset-btn">Add Asset</button>
      </div>
    </div>
  );
}
