import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav>
      <button data-testid="nav-weekly-plan" onClick={() => navigate("weekly-plan")}>Weekly Plan</button>
      <button data-testid="nav-add-meal" onClick={() => navigate("add-meal")}>Add Meal</button>
    </nav>
  );
}
