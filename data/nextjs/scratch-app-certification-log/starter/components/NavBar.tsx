import React from "react";
export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard">Dashboard</button>
      <button data-testid="nav-certifications">Certifications</button>
      <button data-testid="nav-study">Study</button>
      <button data-testid="nav-exams">Exams</button>
    </nav>
  );
}
