'use client'
import React from 'react';
export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-recipes">Recipes</button>
      <button data-testid="nav-planner">Planner</button>
      <button data-testid="nav-shopping">Shopping</button>
    </nav>
  );
}
