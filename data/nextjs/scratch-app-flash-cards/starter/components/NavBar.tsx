'use client'
import React from 'react';

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-decks">Decks</button>
      <button data-testid="nav-study">Study</button>
      <button data-testid="nav-progress">Progress</button>
    </nav>
  );
}
