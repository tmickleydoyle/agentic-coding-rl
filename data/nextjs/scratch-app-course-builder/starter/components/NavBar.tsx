'use client'
import React from 'react';
import { useApp } from './AppStateProvider';
export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home" data-active="false" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-modules" data-active="false" onClick={() => navigate('modules')}>Modules</button>
      <button data-testid="nav-lessons" data-active="false" onClick={() => navigate('lessons')}>Lessons</button>
      <button data-testid="nav-preview" data-active="false" onClick={() => navigate('preview')}>Preview</button>
    </nav>
  );
}
