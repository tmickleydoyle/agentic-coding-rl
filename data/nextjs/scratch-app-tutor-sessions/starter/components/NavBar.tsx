'use client'
import React from 'react';
import { useApp } from './AppStateProvider';
export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home" data-active="false" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-sessions" data-active="false" onClick={() => navigate('sessions')}>Sessions</button>
      <button data-testid="nav-tutors" data-active="false" onClick={() => navigate('tutors')}>Tutors</button>
      <button data-testid="nav-booking" data-active="false" onClick={() => navigate('booking')}>Book</button>
    </nav>
  );
}
