import React from "react";

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-add">Add Allergy</button>
      <button data-testid="nav-reactions">Reactions</button>
      <button data-testid="nav-triggers">Triggers</button>
    </nav>
  );
}
