import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-entries" onClick={() => navigate("/")}>Entries</button>
      <button data-testid="nav-heirs" onClick={() => navigate("/heirs")}>Heirs</button>
      <button data-testid="nav-timeline" onClick={() => navigate("/timeline")}>Timeline</button>
    </nav>
  );
}
