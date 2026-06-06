import React from "react";
import { useApp } from "./AppStateProvider";
export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-calendar" onClick={() => navigate("calendar")}>Calendar</button>
      <button data-testid="nav-create" onClick={() => navigate("create")}>Create Event</button>
      <button data-testid="nav-registrations" onClick={() => navigate("registrations")}>Registrations</button>
    </nav>
  );
}
