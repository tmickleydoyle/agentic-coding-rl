import React from "react";
import { useApp } from "./AppStateProvider";
import { Route } from "../lib/types";

const LINKS: { label: string; route: Route }[] = [
  { label: "Action Items", route: "items" },
  { label: "Completed", route: "completed" },
  { label: "Filter", route: "filter" },
];

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      {LINKS.map((l) => (
        <button key={l.route} data-testid={`nav-${l.route}`} onClick={() => navigate(l.route)} aria-current={route === l.route ? "page" : undefined}>
          {l.label}
        </button>
      ))}
    </nav>
  );
}
