import React from "react";
export function BillsPage() {
  return (
    <div data-testid="bills-page">
      <div data-testid="add-bill-form">
        <input data-testid="bill-name" /><input data-testid="bill-amount" type="number" />
        <input data-testid="bill-due-day" type="number" />
        <select data-testid="bill-category"><option value="other">other</option></select>
        <button data-testid="add-bill-btn">Add Bill</button>
      </div>
      <ul data-testid="bill-list"></ul>
    </div>
  );
}
