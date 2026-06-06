'use client'
import React from 'react';

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-subjects">Subjects</button>
      <button data-testid="nav-sessions">Sessions</button>
      <button data-testid="nav-stats">Stats</button>
    </nav>
  );
}
