'use client'
import React from 'react';
export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-log">Log</button>
      <button data-testid="nav-charts">Charts</button>
      <button data-testid="nav-settings">Settings</button>
    </nav>
  );
}
