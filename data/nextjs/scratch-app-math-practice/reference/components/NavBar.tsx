import React from "react";
import { useApp } from "./AppStateProvider";
import type { Route } from "../lib/types";

const links: { label: string; route: Route }[] = [
  { label: "Home", route: "home" },
  { label: "Problems", route: "problems" },
  { label: "Drills", route: "drills" },
  { label: "Scores", route: "scores" },
];

export function NavBar() {
  const { route, setRoute } = useApp();
  return (
    <nav data-testid="navbar">
      {links.map(l => (
        <button key={l.route} data-testid={`nav-${l.route}`} onClick={() => setRoute(l.route)} aria-current={route === l.route ? "page" : undefined}>
          {l.label}
        </button>
      ))}
    </nav>
  );
}
