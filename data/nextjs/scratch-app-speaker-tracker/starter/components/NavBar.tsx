import React from "react";
export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard">Dashboard</button>
      <button data-testid="nav-speakers">Speakers</button>
      <button data-testid="nav-talks">Talks</button>
      <button data-testid="nav-events">Events</button>
    </nav>
  );
}
