import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-contacts" onClick={() => navigate("/")} aria-current={route === "/" ? "page" : undefined}>Contacts</button>
      <button data-testid="nav-groups" onClick={() => navigate("/groups")} aria-current={route === "/groups" ? "page" : undefined}>Groups</button>
      <button data-testid="nav-favorites" onClick={() => navigate("/favorites")} aria-current={route === "/favorites" ? "page" : undefined}>Favorites</button>
      <button data-testid="nav-import" onClick={() => navigate("/import")} aria-current={route === "/import" ? "page" : undefined}>Import</button>
    </nav>
  );
}
