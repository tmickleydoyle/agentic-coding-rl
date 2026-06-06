import React from "react";
import { useApp } from "./AppStateProvider";

export default function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button onClick={() => navigate("/")} data-testid="nav-home">Home</button>
      <button onClick={() => navigate("/visas")} data-testid="nav-visas">Visas</button>
      <button onClick={() => navigate("/add-visa")} data-testid="nav-add-visa">Add Visa</button>
      <button onClick={() => navigate("/reminders")} data-testid="nav-reminders">Reminders</button>
    </nav>
  );
}
