'use client';
import React from 'react';

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-rankings">Rankings</button>
      <button data-testid="nav-submit">Submit</button>
    </nav>
  );
}
