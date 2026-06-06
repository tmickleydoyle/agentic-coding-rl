import React from "react";

export default function AddListPage() {
  return (
    <div data-testid="add-list-page">
      <input data-testid="input-trip-name" />
      <input data-testid="input-destination" />
      <input data-testid="input-departure-date" type="date" />
      <button data-testid="submit-list">Save List</button>
    </div>
  );
}
