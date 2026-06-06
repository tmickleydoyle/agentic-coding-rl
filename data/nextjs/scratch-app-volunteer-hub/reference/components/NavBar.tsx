import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-volunteers" onClick={() => navigate("volunteers")}
        style={{ fontWeight: route === "volunteers" ? "bold" : "normal" }}>
        Volunteers
      </button>
      <button data-testid="nav-assignments" onClick={() => navigate("assignments")}
        style={{ fontWeight: route === "assignments" ? "bold" : "normal" }}>
        Assignments
      </button>
      <button data-testid="nav-reports" onClick={() => navigate("reports")}
        style={{ fontWeight: route === "reports" ? "bold" : "normal" }}>
        Reports
      </button>
    </nav>
  );
}
