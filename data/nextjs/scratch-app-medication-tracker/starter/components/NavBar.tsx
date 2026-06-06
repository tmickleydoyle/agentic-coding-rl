import React from "react";

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-add">Add Medication</button>
      <button data-testid="nav-schedule">Schedule</button>
      <button data-testid="nav-log">Dose Log</button>
    </nav>
  );
}
