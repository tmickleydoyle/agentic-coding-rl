import React from "react";
import { useApp } from "./AppStateProvider";
import { Route } from "../lib/types";

const links: { label: string; route: Route }[] = [
  { label: "Overview", route: "overview" },
  { label: "Debts", route: "debts" },
  { label: "Payments", route: "payments" },
  { label: "Strategy", route: "strategy" },
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
