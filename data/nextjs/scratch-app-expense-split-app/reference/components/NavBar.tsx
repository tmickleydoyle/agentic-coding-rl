'use client'
import React from 'react';
import { useApp } from './AppStateProvider';
import { Route } from '../lib/types';

export function NavBar() {
  const { navigate, route } = useApp();
  const links: { label: string; route: Route }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Groups', route: 'groups' },
    { label: 'Expenses', route: 'expenses' },
    { label: 'Settle', route: 'settle' },
  ];
  return (
    <nav data-testid="navbar">
      {links.map(l => (
        <button key={l.route} data-testid={`nav-${l.route}`} onClick={() => navigate(l.route)} aria-current={route === l.route ? 'page' : undefined}>
          {l.label}
        </button>
      ))}
    </nav>
  );
}
