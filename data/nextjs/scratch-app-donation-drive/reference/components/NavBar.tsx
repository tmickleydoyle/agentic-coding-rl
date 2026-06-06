import React from "react";
import { useApp } from "./AppStateProvider";
export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-campaigns" onClick={() => navigate("campaigns")}>Campaigns</button>
      <button data-testid="nav-donors" onClick={() => navigate("donors")}>Donors</button>
      <button data-testid="nav-leaderboard" onClick={() => navigate("leaderboard")}>Leaderboard</button>
    </nav>
  );
}
