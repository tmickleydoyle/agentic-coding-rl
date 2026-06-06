import React from "react";
export function ContributionsPage() {
  return (
    <div data-testid="contributions-page">
      <div data-testid="add-contribution-form">
        <select data-testid="contribution-goal"><option value="">Select goal</option></select>
        <input data-testid="contribution-amount" type="number" />
        <input data-testid="contribution-date" type="date" />
        <button data-testid="add-contribution-btn">Add Contribution</button>
      </div>
      <ul data-testid="contribution-list"></ul>
    </div>
  );
}
