import React from "react";
import { useApp } from "./AppStateProvider";
import type { Route } from "../lib/types";

const links: { label: string; route: Route }[] = [
  { label: "Home", route: "home" },
  { label: "Groups", route: "groups" },
  { label: "Members", route: "members" },
  { label: "Sessions", route: "sessions" },
];

export function NavBar() {
  const { setRoute } = useApp();
  return (
    <nav data-testid="navbar">
      {links.map(l => (
        <button key={l.route} data-testid={`nav-${l.route}`} onClick={() => setRoute(l.route)}>{l.label}</button>
      ))}
    </nav>
  );
}
