import React from "react";

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-entries">Entries</button>
      <button data-testid="nav-new-entry">New Entry</button>
      <button data-testid="nav-search">Search</button>
    </nav>
  );
}
