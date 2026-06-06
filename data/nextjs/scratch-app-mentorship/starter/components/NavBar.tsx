import React from "react";
export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard">Dashboard</button>
      <button data-testid="nav-mentors">Mentors</button>
      <button data-testid="nav-sessions">Sessions</button>
      <button data-testid="nav-goals">Goals</button>
    </nav>
  );
}
