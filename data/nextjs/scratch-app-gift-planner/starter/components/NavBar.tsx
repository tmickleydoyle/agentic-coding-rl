import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard" onClick={() => navigate("/")}>Dashboard</button>
      <button data-testid="nav-gifts" onClick={() => navigate("/gifts")}>Gifts</button>
      <button data-testid="nav-occasions" onClick={() => navigate("/occasions")}>Occasions</button>
      <button data-testid="nav-budget" onClick={() => navigate("/budget")}>Budget</button>
      <button data-testid="nav-ideas" onClick={() => navigate("/ideas")}>Ideas</button>
    </nav>
  );
}
