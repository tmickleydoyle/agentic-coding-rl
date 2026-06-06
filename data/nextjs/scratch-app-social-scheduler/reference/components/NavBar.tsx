"use client";
import React from "react";
import { useApp } from "./AppStateProvider";
import { Route } from "../lib/types";

const links: { label: string; route: Route }[] = [
  { label: "Feed", route: "feed" },
  { label: "Compose", route: "compose" },
  { label: "Queue", route: "queue" },
  { label: "Accounts", route: "accounts" },
];

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      {links.map((l) => (
        <button key={l.route} data-testid={`nav-${l.route}`} onClick={() => navigate(l.route)}
          style={{ fontWeight: route === l.route ? "bold" : "normal" }}>{l.label}</button>
      ))}
    </nav>
  );
}
