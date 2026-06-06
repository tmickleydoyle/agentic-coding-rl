'use client';
import React from 'react';
import { useApp } from './AppStateProvider';
import { Route } from '../lib/types';

const links: { label: string; route: Route }[] = [
  { label: 'Home', route: 'home' },
  { label: 'Articles', route: 'articles' },
  { label: 'New Article', route: 'new-article' },
];

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      {links.map((l) => (
        <button key={l.route} data-testid={`nav-${l.route}`} onClick={() => navigate(l.route)}
          style={{ fontWeight: route === l.route ? 'bold' : 'normal', marginRight: 8 }}>
          {l.label}
        </button>
      ))}
    </nav>
  );
}
