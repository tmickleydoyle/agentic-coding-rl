import React from "react";
export function AssetsPage() {
  return (
    <div data-testid="assets-page">
      <div data-testid="add-asset-form">
        <input data-testid="asset-name" /><input data-testid="asset-value" type="number" />
        <select data-testid="asset-category"><option value="other">other</option></select>
        <button data-testid="add-asset-btn">Add Asset</button>
      </div>
      <ul data-testid="asset-list"></ul>
    </div>
  );
}
