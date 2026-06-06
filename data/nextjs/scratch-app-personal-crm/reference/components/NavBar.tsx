import React from "react";
import { useApp } from "./AppStateProvider";
import { Route } from "../lib/types";

const links: { label: string; route: Route }[] = [
  { label: "Dashboard", route: "dashboard" },
  { label: "Contacts", route: "contacts" },
  { label: "Notes", route: "notes" },
  { label: "Tags", route: "tags" },
];

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      {links.map((l) => (
        <button key={l.route} data-testid={`nav-${l.route}`} onClick={() => navigate(l.route)}>
          {l.label}
        </button>
      ))}
    </nav>
  );
}
