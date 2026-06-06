import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard" onClick={() => navigate("/")}>Dashboard</button>
      <button data-testid="nav-documents" onClick={() => navigate("/documents")}>Documents</button>
      <button data-testid="nav-folders" onClick={() => navigate("/folders")}>Folders</button>
      <button data-testid="nav-shared" onClick={() => navigate("/shared")}>Shared</button>
      <button data-testid="nav-search" onClick={() => navigate("/search")}>Search</button>
    </nav>
  );
}
