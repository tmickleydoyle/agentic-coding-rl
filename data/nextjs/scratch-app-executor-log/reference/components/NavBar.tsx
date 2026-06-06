import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-tasks" onClick={() => navigate("/")}>Tasks</button>
      <button data-testid="nav-contacts" onClick={() => navigate("/contacts")}>Contacts</button>
      <button data-testid="nav-progress" onClick={() => navigate("/progress")}>Progress</button>
    </nav>
  );
}
