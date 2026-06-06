import React from "react";
export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard">Dashboard</button>
      <button data-testid="nav-bills">Bills</button>
      <button data-testid="nav-calendar">Calendar</button>
      <button data-testid="nav-settings">Settings</button>
    </nav>
  );
}
