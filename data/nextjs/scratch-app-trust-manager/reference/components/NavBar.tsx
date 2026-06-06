import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-trusts" onClick={() => navigate("/")}>Trusts</button>
      <button data-testid="nav-distributions" onClick={() => navigate("/distributions")}>Distributions</button>
      <button data-testid="nav-overview" onClick={() => navigate("/overview")}>Overview</button>
    </nav>
  );
}
