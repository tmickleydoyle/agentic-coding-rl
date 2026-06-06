import React from "react";

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-log">Log Steps</button>
      <button data-testid="nav-history">History</button>
      <button data-testid="nav-goals">Goals</button>
    </nav>
  );
}
