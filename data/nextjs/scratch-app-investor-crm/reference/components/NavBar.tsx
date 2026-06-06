import React from "react";
import { useApp } from "./AppStateProvider";

const links = [
  { label: "Dashboard", path: "/" },
  { label: "Investors", path: "/investors" },
  { label: "Interactions", path: "/interactions" },
  { label: "Pipeline", path: "/pipeline" },
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
