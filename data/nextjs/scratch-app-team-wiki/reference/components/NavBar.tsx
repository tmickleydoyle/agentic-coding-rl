import React from "react";
import { useApp } from "./AppStateProvider";

const links = [
  { label: "Home", path: "/" },
  { label: "Pages", path: "/pages" },
  { label: "Categories", path: "/categories" },
  { label: "Search", path: "/search" },
];

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      {links.map((l) => (
        <button
          key={l.path}
          data-testid={`nav-${l.label.toLowerCase()}`}
          onClick={() => navigate(l.path)}
          style={{ fontWeight: route === l.path ? "bold" : "normal" }}
        >
          {l.label}
        </button>
      ))}
    </nav>
  );
}
