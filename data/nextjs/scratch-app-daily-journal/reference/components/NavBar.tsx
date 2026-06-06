import React from "react";
import { useApp } from "./AppStateProvider";
import type { Route } from "../lib/types";

const links: { label: string; route: Route }[] = [
  { label: "Home", route: "home" },
  { label: "Entries", route: "entries" },
  { label: "New Entry", route: "new-entry" },
  { label: "Search", route: "search" },
];

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      {links.map((l) => (
        <button
          key={l.route}
          data-testid={`nav-${l.route}`}
          onClick={() => navigate(l.route)}
          aria-current={route === l.route ? "page" : undefined}
        >
          {l.label}
        </button>
      ))}
    </nav>
  );
}
