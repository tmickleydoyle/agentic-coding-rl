'use client'
import React from 'react';
import { useApp } from './AppStateProvider';
export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home" data-active="false" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-certificates" data-active="false" onClick={() => navigate('certificates')}>Certificates</button>
      <button data-testid="nav-skills" data-active="false" onClick={() => navigate('skills')}>Skills</button>
      <button data-testid="nav-issued" data-active="false" onClick={() => navigate('issued')}>Issued</button>
    </nav>
  );
}
