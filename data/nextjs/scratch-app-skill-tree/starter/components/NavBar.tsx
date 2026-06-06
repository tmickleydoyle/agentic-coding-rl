'use client'
import React from 'react';
import { useApp } from './AppStateProvider';
export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home" data-active="false" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-skills" data-active="false" onClick={() => navigate('skills')}>Skills</button>
      <button data-testid="nav-paths" data-active="false" onClick={() => navigate('paths')}>Paths</button>
      <button data-testid="nav-progress" data-active="false" onClick={() => navigate('progress')}>Progress</button>
    </nav>
  );
}
