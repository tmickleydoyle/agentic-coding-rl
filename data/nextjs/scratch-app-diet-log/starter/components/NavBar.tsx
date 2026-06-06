import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav>
      <button data-testid="nav-log" onClick={() => navigate("log")}>Log</button>
      <button data-testid="nav-add-entry" onClick={() => navigate("add-entry")}>Add Entry</button>
      <button data-testid="nav-summary" onClick={() => navigate("summary")}>Summary</button>
    </nav>
  );
}
