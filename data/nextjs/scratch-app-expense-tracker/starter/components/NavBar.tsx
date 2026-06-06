'use client';
import React from 'react';
import { useApp } from './AppStateProvider';

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav>
      <button data-testid="nav-home" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-expenses" onClick={() => navigate('expenses')}>Expenses</button>
      <button data-testid="nav-categories" onClick={() => navigate('categories')}>Categories</button>
      <button data-testid="nav-summary" onClick={() => navigate('summary')}>Summary</button>
    </nav>
  );
}
