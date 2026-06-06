import React from "react";
import { useApp } from "./AppStateProvider";
export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-residents" onClick={() => navigate("residents")}>Residents</button>
      <button data-testid="nav-beds" onClick={() => navigate("beds")}>Beds</button>
      <button data-testid="nav-services" onClick={() => navigate("services")}>Services</button>
    </nav>
  );
}
