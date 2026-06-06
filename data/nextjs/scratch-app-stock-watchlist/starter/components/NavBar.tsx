'use client'
import React from 'react';
export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-watchlist">Watchlist</button>
      <button data-testid="nav-alerts">Alerts</button>
      <button data-testid="nav-history">History</button>
    </nav>
  );
}
