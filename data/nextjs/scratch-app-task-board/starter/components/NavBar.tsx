'use client';
import React from 'react';
import { useApp } from './AppStateProvider';
export function NavBar() {
  const { navigate } = useApp();
  return <nav>
    <button data-testid="nav-home" onClick={() => navigate('home')}>Home</button>
    <button data-testid="nav-board" onClick={() => navigate('board')}>Board</button>
    <button data-testid="nav-completed" onClick={() => navigate('completed')}>Completed</button>
    <button data-testid="nav-settings" onClick={() => navigate('settings')}>Settings</button>
  </nav>;
}
