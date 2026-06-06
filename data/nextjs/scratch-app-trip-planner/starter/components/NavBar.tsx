import React from "react";

export default function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-trips">Trips</button>
      <button data-testid="nav-new-trip">New Trip</button>
      <button data-testid="nav-calendar">Calendar</button>
    </nav>
  );
}
