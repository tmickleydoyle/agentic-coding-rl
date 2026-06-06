import React from "react";
export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-overview">Overview</button>
      <button data-testid="nav-documents">Documents</button>
      <button data-testid="nav-deductions">Deductions</button>
      <button data-testid="nav-notes">Notes</button>
    </nav>
  );
}
