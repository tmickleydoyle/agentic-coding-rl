import React from "react";
export function LiabilitiesPage() {
  return (
    <div data-testid="liabilities-page">
      <div data-testid="add-liability-form">
        <input data-testid="liability-name" /><input data-testid="liability-amount" type="number" />
        <select data-testid="liability-category"><option value="other">other</option></select>
        <button data-testid="add-liability-btn">Add Liability</button>
      </div>
      <ul data-testid="liability-list"></ul>
    </div>
  );
}
