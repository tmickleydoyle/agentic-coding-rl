import React from "react";
import { useApp } from "./AppStateProvider";

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard" onClick={() => navigate("/")}>Dashboard</button>
      <button data-testid="nav-policies" onClick={() => navigate("/policies")}>Policies</button>
      <button data-testid="nav-claims" onClick={() => navigate("/claims")}>Claims</button>
      <button data-testid="nav-documents" onClick={() => navigate("/documents")}>Documents</button>
      <button data-testid="nav-contacts" onClick={() => navigate("/contacts")}>Contacts</button>
    </nav>
  );
}
