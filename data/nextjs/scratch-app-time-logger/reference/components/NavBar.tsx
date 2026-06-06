'use client';
import React from 'react';
import { useApp } from './AppStateProvider';
export function NavBar() {
  const { navigate } = useApp();
  return <nav>
    <button data-testid="nav-home" onClick={() => navigate('home')}>Home</button>
    <button data-testid="nav-logs" onClick={() => navigate('logs')}>Logs</button>
    <button data-testid="nav-projects" onClick={() => navigate('projects')}>Projects</button>
    <button data-testid="nav-report" onClick={() => navigate('report')}>Report</button>
  </nav>;
}
