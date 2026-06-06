import React from "react";
export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard">Dashboard</button>
      <button data-testid="nav-skills">Skills</button>
      <button data-testid="nav-progress">Progress</button>
      <button data-testid="nav-resources">Resources</button>
    </nav>
  );
}
