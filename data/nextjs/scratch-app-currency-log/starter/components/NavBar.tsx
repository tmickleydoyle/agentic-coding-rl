import React from "react";

export default function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-log">Log</button>
      <button data-testid="nav-add">Add Exchange</button>
      <button data-testid="nav-summary">Summary</button>
    </nav>
  );
}
