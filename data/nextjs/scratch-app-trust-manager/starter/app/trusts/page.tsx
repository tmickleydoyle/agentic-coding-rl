import React from "react";

export function TrustsPage() {
  return (
    <div data-testid="trusts-page">
      <h1>Trusts</h1>
      <p data-testid="no-trusts">No trusts found.</p>
      <div data-testid="add-trust-form">
        <input data-testid="trust-name-input" placeholder="Name" />
        <input data-testid="trust-trustee-input" placeholder="Trustee" />
        <input data-testid="trust-principal-input" type="number" placeholder="Principal" />
        <button data-testid="add-trust-btn">Add Trust</button>
      </div>
    </div>
  );
}
