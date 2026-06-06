import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-contacts" onClick={() => navigate("/")}>Contacts</button>
      <button data-testid="nav-groups" onClick={() => navigate("/groups")}>Groups</button>
      <button data-testid="nav-favorites" onClick={() => navigate("/favorites")}>Favorites</button>
      <button data-testid="nav-import" onClick={() => navigate("/import")}>Import</button>
    </nav>
  );
}
