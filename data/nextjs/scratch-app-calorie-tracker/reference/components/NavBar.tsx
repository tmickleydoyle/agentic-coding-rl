import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav>
      <button data-testid="nav-tracker" onClick={() => navigate("tracker")}>Tracker</button>
      <button data-testid="nav-add-food" onClick={() => navigate("add-food")}>Add Food</button>
      <button data-testid="nav-goals" onClick={() => navigate("goals")}>Goals</button>
    </nav>
  );
}
