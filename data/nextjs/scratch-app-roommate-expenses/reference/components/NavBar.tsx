import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard" onClick={() => navigate("/")} aria-current={route === "/" ? "page" : undefined}>Dashboard</button>
      <button data-testid="nav-expenses" onClick={() => navigate("/expenses")} aria-current={route === "/expenses" ? "page" : undefined}>Expenses</button>
      <button data-testid="nav-roommates" onClick={() => navigate("/roommates")} aria-current={route === "/roommates" ? "page" : undefined}>Roommates</button>
      <button data-testid="nav-settle" onClick={() => navigate("/settle")} aria-current={route === "/settle" ? "page" : undefined}>Settle Up</button>
      <button data-testid="nav-history" onClick={() => navigate("/history")} aria-current={route === "/history" ? "page" : undefined}>History</button>
    </nav>
  );
}
