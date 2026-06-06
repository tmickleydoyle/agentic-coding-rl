import React from "react";

export function BeneficiariesPage() {
  return (
    <div data-testid="beneficiaries-page">
      <h1>Beneficiaries</h1>
      <p data-testid="no-beneficiaries">No beneficiaries found.</p>
      <div data-testid="add-beneficiary-form">
        <input data-testid="beneficiary-name-input" placeholder="Name" />
        <select data-testid="beneficiary-rel-select"><option>Other</option></select>
        <button data-testid="add-beneficiary-btn">Add Beneficiary</button>
      </div>
    </div>
  );
}
