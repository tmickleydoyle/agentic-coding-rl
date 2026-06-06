import React from "react";
import { useApp } from "./AppStateProvider";

export default function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button onClick={() => navigate("/")} data-testid="nav-home">Home</button>
      <button onClick={() => navigate("/trips")} data-testid="nav-trips">Trips</button>
      <button onClick={() => navigate("/new-trip")} data-testid="nav-new-trip">New Trip</button>
      <button onClick={() => navigate("/calendar")} data-testid="nav-calendar">Calendar</button>
    </nav>
  );
}
