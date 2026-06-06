"use client";
import React from "react";
import { useApp } from "./AppStateProvider";
import { Route } from "../lib/types";
export function NavBar() {
  const { navigate } = useApp();
  const links: { label: string; route: Route }[] = [
    { label: "Games", route: "games" },
    { label: "Players", route: "players" },
    { label: "Leaderboard", route: "leaderboard" },
  ];
  return (
    <nav data-testid="navbar">
      {links.map((l) => <button key={l.route} data-testid={`nav-${l.route}`} onClick={() => navigate(l.route)}>{l.label}</button>)}
    </nav>
  );
}
