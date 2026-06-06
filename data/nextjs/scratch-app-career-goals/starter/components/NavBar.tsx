import React from "react";
export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard">Dashboard</button>
      <button data-testid="nav-milestones">Milestones</button>
      <button data-testid="nav-applications">Applications</button>
      <button data-testid="nav-skills">Skills</button>
    </nav>
  );
}
