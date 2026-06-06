'use client'
import React from 'react';
export function NavBar() {
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home">Home</button>
      <button data-testid="nav-groups">Groups</button>
      <button data-testid="nav-expenses">Expenses</button>
      <button data-testid="nav-settle">Settle</button>
    </nav>
  );
}
