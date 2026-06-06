import React from "react";

export default function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-visas">Visas</button>
      <button data-testid="nav-add-visa">Add Visa</button>
      <button data-testid="nav-reminders">Reminders</button>
    </nav>
  );
}
