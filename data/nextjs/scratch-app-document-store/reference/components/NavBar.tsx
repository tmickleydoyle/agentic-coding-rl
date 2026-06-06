import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard" onClick={() => navigate("/")} aria-current={route === "/" ? "page" : undefined}>Dashboard</button>
      <button data-testid="nav-documents" onClick={() => navigate("/documents")} aria-current={route === "/documents" ? "page" : undefined}>Documents</button>
      <button data-testid="nav-folders" onClick={() => navigate("/folders")} aria-current={route === "/folders" ? "page" : undefined}>Folders</button>
      <button data-testid="nav-shared" onClick={() => navigate("/shared")} aria-current={route === "/shared" ? "page" : undefined}>Shared</button>
      <button data-testid="nav-search" onClick={() => navigate("/search")} aria-current={route === "/search" ? "page" : undefined}>Search</button>
    </nav>
  );
}
