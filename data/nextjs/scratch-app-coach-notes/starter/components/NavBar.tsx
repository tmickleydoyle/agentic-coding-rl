import React from "react";
import { useApp } from "./AppStateProvider";
import { Route } from "../lib/types";

const LINKS: { label: string; route: Route }[] = [
  { label: "Athletes", route: "athletes" },
  { label: "Sessions", route: "sessions" },
  { label: "Drills", route: "drills" },
  { label: "Review", route: "review" },
];

export default function NavBar() {
  const { setRoute } = useApp();
  return (
    <nav data-testid="navbar">
      {LINKS.map((l) => (
        <button key={l.route} data-testid={`nav-${l.route}`} onClick={() => setRoute(l.route)}>{l.label}</button>
      ))}
    </nav>
  );
}
