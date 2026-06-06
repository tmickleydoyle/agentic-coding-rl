import React from "react";

export default function App() {
  return (
    <div>
      <h1>Pet Adoption Tracker</h1>
      <div data-testid="summary-counts">
        <span data-testid="count-available"></span>
        <span data-testid="count-pending"></span>
        <span data-testid="count-adopted"></span>
      </div>
      <div data-testid="filter-bar"></div>
      <div data-testid="pets-list"></div>
      <form data-testid="add-pet-form"></form>
    </div>
  );
}
