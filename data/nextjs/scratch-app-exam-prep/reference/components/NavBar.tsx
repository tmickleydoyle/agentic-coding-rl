import React from "react";
import { useApp } from "./AppStateProvider";
import type { Route } from "../lib/types";

const links: { label: string; route: Route }[] = [
  { label: "Home", route: "home" },
  { label: "Exams", route: "exams" },
  { label: "Practice", route: "practice" },
  { label: "Results", route: "results" },
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
