import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav>
      <button data-testid="nav-schedule" onClick={() => navigate("schedule")}>Schedule</button>
      <button data-testid="nav-add-supplement" onClick={() => navigate("add-supplement")}>Add Supplement</button>
      <button data-testid="nav-log-dose" onClick={() => navigate("log-dose")}>Log Dose</button>
    </nav>
  );
}
