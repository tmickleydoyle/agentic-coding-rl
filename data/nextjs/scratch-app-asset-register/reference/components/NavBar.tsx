import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-register" onClick={() => navigate("/")}>Register</button>
      <button data-testid="nav-valuations" onClick={() => navigate("/valuations")}>Valuations</button>
      <button data-testid="nav-summary" onClick={() => navigate("/summary")}>Summary</button>
    </nav>
  );
}
