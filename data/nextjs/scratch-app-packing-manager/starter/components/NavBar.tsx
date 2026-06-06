import React from "react";

export default function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-lists">Lists</button>
      <button data-testid="nav-add-list">Add List</button>
      <button data-testid="nav-checklist">Checklist</button>
    </nav>
  );
}
