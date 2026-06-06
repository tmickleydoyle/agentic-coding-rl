import React from "react";
export function DeductionsPage() {
  return (
    <div data-testid="deductions-page">
      <div data-testid="add-deduction-form">
        <input data-testid="deduction-description" />
        <input data-testid="deduction-amount" type="number" />
        <select data-testid="deduction-category"><option value="other">other</option></select>
        <button data-testid="add-deduction-btn">Add Deduction</button>
      </div>
      <select data-testid="filter-category"><option value="all">All</option></select>
      <ul data-testid="deduction-list"></ul>
    </div>
  );
}
