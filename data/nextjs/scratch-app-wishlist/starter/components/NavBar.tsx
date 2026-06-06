"use client";
import React from "react";
import { useApp } from "./AppStateProvider";
import type { Route } from "../lib/types";

const links: { label: string; route: Route }[] = [
  { label: "Home", route: "/" },
  { label: "Items", route: "/items" },
  { label: "Categories", route: "/categories" },
  { label: "Shared", route: "/shared" },
];

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      {links.map((l) => (
        <button key={l.route} data-testid={`nav-${l.route.replace("/", "") || "home"}`} onClick={() => navigate(l.route)} style={{ fontWeight: route === l.route ? "bold" : "normal" }}>{l.label}</button>
      ))}
    </nav>
  );
}
