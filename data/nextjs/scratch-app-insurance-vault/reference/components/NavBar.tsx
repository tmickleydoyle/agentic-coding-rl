import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard" onClick={() => navigate("/")} aria-current={route === "/" ? "page" : undefined}>Dashboard</button>
      <button data-testid="nav-policies" onClick={() => navigate("/policies")} aria-current={route === "/policies" ? "page" : undefined}>Policies</button>
      <button data-testid="nav-claims" onClick={() => navigate("/claims")} aria-current={route === "/claims" ? "page" : undefined}>Claims</button>
      <button data-testid="nav-documents" onClick={() => navigate("/documents")} aria-current={route === "/documents" ? "page" : undefined}>Documents</button>
      <button data-testid="nav-contacts" onClick={() => navigate("/contacts")} aria-current={route === "/contacts" ? "page" : undefined}>Contacts</button>
    </nav>
  );
}
