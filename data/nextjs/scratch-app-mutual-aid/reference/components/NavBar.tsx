import React from "react";
import { useApp } from "./AppStateProvider";
export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-requests" onClick={() => navigate("requests")}>Requests</button>
      <button data-testid="nav-offers" onClick={() => navigate("offers")}>Offers</button>
      <button data-testid="nav-matches" onClick={() => navigate("matches")}>Matches</button>
    </nav>
  );
}
