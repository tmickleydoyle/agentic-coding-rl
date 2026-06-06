import React from "react";

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard">Dashboard</button>
      <button data-testid="nav-contacts">Contacts</button>
      <button data-testid="nav-notes">Notes</button>
      <button data-testid="nav-tags">Tags</button>
    </nav>
  );
}
