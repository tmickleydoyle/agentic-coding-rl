import React from "react";
export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard">Dashboard</button>
      <button data-testid="nav-events">Events</button>
      <button data-testid="nav-connections">Connections</button>
      <button data-testid="nav-followups">Follow-ups</button>
    </nav>
  );
}
