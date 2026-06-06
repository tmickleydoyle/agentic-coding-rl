import React from "react";

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-dashboard">Dashboard</button>
      <button data-testid="nav-jobs">Jobs</button>
      <button data-testid="nav-candidates">Candidates</button>
      <button data-testid="nav-interviews">Interviews</button>
    </nav>
  );
}
