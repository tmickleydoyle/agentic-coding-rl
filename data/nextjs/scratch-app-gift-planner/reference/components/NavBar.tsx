import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard" onClick={() => navigate("/")} aria-current={route === "/" ? "page" : undefined}>Dashboard</button>
      <button data-testid="nav-gifts" onClick={() => navigate("/gifts")} aria-current={route === "/gifts" ? "page" : undefined}>Gifts</button>
      <button data-testid="nav-occasions" onClick={() => navigate("/occasions")} aria-current={route === "/occasions" ? "page" : undefined}>Occasions</button>
      <button data-testid="nav-budget" onClick={() => navigate("/budget")} aria-current={route === "/budget" ? "page" : undefined}>Budget</button>
      <button data-testid="nav-ideas" onClick={() => navigate("/ideas")} aria-current={route === "/ideas" ? "page" : undefined}>Ideas</button>
    </nav>
  );
}
