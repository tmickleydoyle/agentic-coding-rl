import React from "react";

export default function App() {
  return (
    <div>
      <h1>Vet Visit Log</h1>
      <div data-testid="pet-selector"></div>
      <div data-testid="pet-info">
        <span data-testid="pet-name"></span>
        <span data-testid="pet-species"></span>
      </div>
      <div data-testid="next-appt-banner"></div>
      <form data-testid="add-visit-form"></form>
    </div>
  );
}
