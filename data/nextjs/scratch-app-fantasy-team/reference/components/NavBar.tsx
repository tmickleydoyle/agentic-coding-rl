"use client";
import React from "react";
import { useApp } from "./AppStateProvider";
import { Route } from "../lib/types";
export function NavBar() {
  const { navigate } = useApp();
  const links: { label: string; route: Route }[] = [
    { label: "Roster", route: "roster" },
    { label: "Waivers", route: "waivers" },
    { label: "Standings", route: "standings" },
  ];
  return (
    <nav data-testid="navbar">
      {links.map((l) => <button key={l.route} data-testid={`nav-${l.route}`} onClick={() => navigate(l.route)}>{l.label}</button>)}
    </nav>
  );
}
