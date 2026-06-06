import React from "react";
import { useApp } from "./AppStateProvider";

export default function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button onClick={() => navigate("/")} data-testid="nav-home">Home</button>
      <button onClick={() => navigate("/log")} data-testid="nav-log">Log</button>
      <button onClick={() => navigate("/add-exchange")} data-testid="nav-add">Add Exchange</button>
      <button onClick={() => navigate("/summary")} data-testid="nav-summary">Summary</button>
    </nav>
  );
}
