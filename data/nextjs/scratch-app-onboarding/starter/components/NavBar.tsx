import React from "react";

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard">Dashboard</button>
      <button data-testid="nav-employees">Employees</button>
      <button data-testid="nav-tasks">Tasks</button>
      <button data-testid="nav-checklist">Checklist</button>
    </nav>
  );
}
