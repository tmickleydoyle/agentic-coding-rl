import React from "react";
import { useApp } from "./AppStateProvider";
import { Route } from "../lib/types";

const links: { label: string; route: Route }[] = [
  { label: "Portfolio", route: "portfolio" },
  { label: "Holdings", route: "holdings" },
  { label: "Transactions", route: "transactions" },
  { label: "Performance", route: "performance" },
];

export function NavBar() {
  const { route, setRoute } = useApp();
  return (
    <nav data-testid="navbar">
      {links.map((l) => (
        <button key={l.route} data-testid={`nav-${l.route}`} onClick={() => setRoute(l.route)}
          aria-current={route === l.route ? "page" : undefined}>{l.label}</button>
      ))}
    </nav>
  );
}
