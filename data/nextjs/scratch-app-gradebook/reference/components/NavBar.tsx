'use client'
import React from 'react';
import { useApp } from './AppStateProvider';
import type { Route } from '../lib/types';

const LINKS: { label: string; route: Route }[] = [
  { label: 'Home', route: 'home' },
  { label: 'Students', route: 'students' },
  { label: 'Grades', route: 'grades' },
  { label: 'Reports', route: 'reports' },
];

export function NavBar() {
  const { route, navigate } = useApp();
  return (
    <nav data-testid="navbar">
      {LINKS.map((l) => (
        <button
          key={l.route}
          data-testid={`nav-${l.route}`}
          data-active={route === l.route ? 'true' : 'false'}
          onClick={() => navigate(l.route)}
        >
          {l.label}
        </button>
      ))}
    </nav>
  );
}
