"use client";
import React from "react";
import { useApp } from "./AppStateProvider";
import { Route } from "../lib/types";

const links: { label: string; route: Route }[] = [
  { label: "Keywords", route: "keywords" },
  { label: "Pages", route: "pages" },
  { label: "Backlinks", route: "backlinks" },
  { label: "Reports", route: "reports" },
];

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      {links.map((l) => (
        <button key={l.route} data-testid={`nav-${l.route}`} onClick={() => navigate(l.route)}>{l.label}</button>
      ))}
    </nav>
  );
}
