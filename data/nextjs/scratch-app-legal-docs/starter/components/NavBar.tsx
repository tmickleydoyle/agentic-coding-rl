import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home" onClick={() => navigate({ name: "home" })}>
        Home
      </button>
      <button data-testid="nav-docs" onClick={() => navigate({ name: "list" })}>
        Documents
      </button>
    </nav>
  );
}
