import React from "react";
import { useApp } from "./AppStateProvider";
import { Route } from "../lib/types";

const LINKS: { label: string; route: Route }[] = [
  { label: "Profile", route: "profile" },
  { label: "Metrics", route: "metrics" },
  { label: "Events", route: "events" },
  { label: "Achievements", route: "achievements" },
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
