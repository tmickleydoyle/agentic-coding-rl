'use client';
import React from 'react';
import { useApp } from './AppStateProvider';
import type { Route } from '../lib/types';

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav style={{ display: 'flex', gap: 16, padding: 12, background: '#1e293b' }}>
      <button data-testid="nav-home" onClick={() => navigate('home')} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>Home</button>
      <button data-testid="nav-expenses" onClick={() => navigate('expenses')} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>Expenses</button>
      <button data-testid="nav-categories" onClick={() => navigate('categories')} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>Categories</button>
      <button data-testid="nav-summary" onClick={() => navigate('summary')} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>Summary</button>
    </nav>
  );
}
