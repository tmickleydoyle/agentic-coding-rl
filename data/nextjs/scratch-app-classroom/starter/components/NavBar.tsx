'use client'
import React from 'react';
import { useApp } from './AppStateProvider';

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home" data-active="false" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-roster" data-active="false" onClick={() => navigate('roster')}>Roster</button>
      <button data-testid="nav-schedule" data-active="false" onClick={() => navigate('schedule')}>Schedule</button>
      <button data-testid="nav-assignments" data-active="false" onClick={() => navigate('assignments')}>Assignments</button>
    </nav>
  );
}
