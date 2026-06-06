import React from "react";
import { useApp } from "./AppStateProvider";
import { Route } from "../lib/types";

const LINKS: { label: string; route: Route }[] = [
  { label: "Dashboard", route: "dashboard" },
  { label: "Workouts", route: "workouts" },
  { label: "Schedule", route: "schedule" },
  { label: "Progress", route: "progress" },
];

export default function NavBar() {
  const { route, setRoute } = useApp();
  return (
    <nav data-testid="navbar">
      {LINKS.map((l) => (
        <button
          key={l.route}
          data-testid={`nav-${l.route}`}
          onClick={() => setRoute(l.route)}
          aria-current={route === l.route ? "page" : undefined}
        >
          {l.label}
        </button>
      ))}
    </nav>
  );
}
