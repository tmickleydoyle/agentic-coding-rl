import React from "react";

export function WitnessesPage() {
  return (
    <div data-testid="witnesses-page">
      <h1>Witnesses</h1>
      <p data-testid="no-witnesses">No witnesses yet.</p>
      <div data-testid="add-witness-form">
        <input data-testid="witness-name-input" placeholder="Name" />
        <button data-testid="add-witness-btn">Add Witness</button>
      </div>
    </div>
  );
}
