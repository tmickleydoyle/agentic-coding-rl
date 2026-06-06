"use client";
import React from "react";
import { useApp } from "./AppStateProvider";
import { Route } from "../lib/types";

const links: { label: string; route: Route }[] = [
  { label: "Dashboard", route: "dashboard" },
  { label: "Posts", route: "posts" },
  { label: "Ideas", route: "ideas" },
  { label: "Schedule", route: "schedule" },
];

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      {links.map((l) => (
        <button key={l.route} data-testid={`nav-${l.route}`} onClick={() => navigate(l.route)}
          style={{ fontWeight: route === l.route ? "bold" : "normal" }}>
          {l.label}
        </button>
      ))}
    </nav>
  );
}
