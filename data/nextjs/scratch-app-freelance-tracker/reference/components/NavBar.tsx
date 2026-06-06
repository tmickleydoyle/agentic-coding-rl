'use client';
import React from 'react';
import { useApp } from './AppStateProvider';
import type { Route } from '../lib/types';

export function NavBar() {
  const { route, navigate } = useApp();
  const links: { label: string; route: Route; testId: string }[] = [
    { label: 'Home', route: 'home', testId: 'nav-home' },
    { label: 'Clients', route: 'clients', testId: 'nav-clients' },
    { label: 'Projects', route: 'projects', testId: 'nav-projects' },
    { label: 'Invoices', route: 'invoices', testId: 'nav-invoices' },
  ];
  return (
    <nav>
      {links.map(l => (
        <button
          key={l.route}
          data-testid={l.testId}
          data-active={route === l.route ? 'true' : 'false'}
          onClick={() => navigate(l.route)}
        >
          {l.label}
        </button>
      ))}
    </nav>
  );
}
