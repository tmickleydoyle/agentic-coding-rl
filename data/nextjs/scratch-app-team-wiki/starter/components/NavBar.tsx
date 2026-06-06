import React from "react";

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-pages">Pages</button>
      <button data-testid="nav-categories">Categories</button>
      <button data-testid="nav-search">Search</button>
    </nav>
  );
}
