import React from "react";

export default function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-schedule">Schedule</button>
      <button data-testid="nav-add-activity">Add Activity</button>
      <button data-testid="nav-map-view">Map View</button>
    </nav>
  );
}
