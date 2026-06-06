import React from "react";
import { useApp } from "./AppStateProvider";

export default function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button onClick={() => navigate("/")} data-testid="nav-home">Home</button>
      <button onClick={() => navigate("/journal")} data-testid="nav-journal">Journal</button>
      <button onClick={() => navigate("/new-entry")} data-testid="nav-new-entry">New Entry</button>
      <button onClick={() => navigate("/stats")} data-testid="nav-stats">Stats</button>
    </nav>
  );
}
