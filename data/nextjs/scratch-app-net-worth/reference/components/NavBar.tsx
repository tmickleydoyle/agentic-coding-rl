import React from "react";
import { useApp } from "./AppStateProvider";
import { Route } from "../lib/types";

const links: { label: string; route: Route }[] = [
  { label: "Summary", route: "summary" },
  { label: "Assets", route: "assets" },
  { label: "Liabilities", route: "liabilities" },
  { label: "History", route: "history" },
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
