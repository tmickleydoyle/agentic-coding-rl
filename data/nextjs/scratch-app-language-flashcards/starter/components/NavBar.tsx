'use client';
import React from 'react';
export function NavBar() {
  return <nav>
    <button data-testid="nav-home" data-active="false">Home</button>
    <button data-testid="nav-decks" data-active="false">Decks</button>
    <button data-testid="nav-study" data-active="false">Study</button>
    <button data-testid="nav-stats" data-active="false">Stats</button>
  </nav>;
}
