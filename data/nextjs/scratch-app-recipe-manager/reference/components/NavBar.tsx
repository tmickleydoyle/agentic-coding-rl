import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav>
      <button data-testid="nav-dashboard" onClick={() => navigate("dashboard")}>
        Dashboard
      </button>
      <button data-testid="nav-add-recipe" onClick={() => navigate("add-recipe")}>
        Add Recipe
      </button>
    </nav>
  );
}
