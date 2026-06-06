import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-clauses" onClick={() => navigate("/")}>Clauses</button>
      <button data-testid="nav-witnesses" onClick={() => navigate("/witnesses")}>Witnesses</button>
      <button data-testid="nav-summary" onClick={() => navigate("/summary")}>Summary</button>
    </nav>
  );
}
