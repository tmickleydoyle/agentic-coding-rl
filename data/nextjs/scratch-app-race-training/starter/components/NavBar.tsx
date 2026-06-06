import React from "react";
import { useApp } from "./AppStateProvider";
import { Route } from "../lib/types";

const LINKS: { label: string; route: Route }[] = [
  { label: "Plan", route: "plan" },
  { label: "Runs", route: "runs" },
  { label: "Goals", route: "goals" },
  { label: "Log", route: "log" },
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
