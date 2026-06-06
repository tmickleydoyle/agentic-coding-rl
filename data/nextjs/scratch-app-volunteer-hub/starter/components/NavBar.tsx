import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-volunteers" onClick={() => navigate("volunteers")}>Volunteers</button>
      <button data-testid="nav-assignments" onClick={() => navigate("assignments")}>Assignments</button>
      <button data-testid="nav-reports" onClick={() => navigate("reports")}>Reports</button>
    </nav>
  );
}
