'use client'
import React from 'react';

export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-library">Library</button>
      <button data-testid="nav-quiz">Quiz</button>
      <button data-testid="nav-results">Results</button>
    </nav>
  );
}
