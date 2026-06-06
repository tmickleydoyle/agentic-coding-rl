import React from "react";

export default function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-journal">Journal</button>
      <button data-testid="nav-new-entry">New Entry</button>
      <button data-testid="nav-stats">Stats</button>
    </nav>
  );
}
