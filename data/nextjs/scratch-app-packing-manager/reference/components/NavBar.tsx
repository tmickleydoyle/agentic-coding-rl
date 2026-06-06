import React from "react";
import { useApp } from "./AppStateProvider";

export default function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button onClick={() => navigate("/")} data-testid="nav-home">Home</button>
      <button onClick={() => navigate("/lists")} data-testid="nav-lists">Lists</button>
      <button onClick={() => navigate("/add-list")} data-testid="nav-add-list">Add List</button>
      <button onClick={() => navigate("/checklist")} data-testid="nav-checklist">Checklist</button>
    </nav>
  );
}
