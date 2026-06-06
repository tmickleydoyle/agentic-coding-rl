'use client';
import React from 'react';
import { useApp } from './AppStateProvider';
export function NavBar() {
  const { navigate } = useApp();
  return <nav>
    <button data-testid="nav-home" onClick={() => navigate('home')}>Home</button>
    <button data-testid="nav-notes" onClick={() => navigate('notes')}>Notes</button>
    <button data-testid="nav-tags" onClick={() => navigate('tags')}>Tags</button>
    <button data-testid="nav-archive" onClick={() => navigate('archive')}>Archive</button>
  </nav>;
}
