'use client'
import React from 'react';
import { useApp } from './AppStateProvider';

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home" data-active="false" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-courses" data-active="false" onClick={() => navigate('courses')}>Courses</button>
      <button data-testid="nav-profile" data-active="false" onClick={() => navigate('profile')}>Profile</button>
      <button data-testid="nav-progress" data-active="false" onClick={() => navigate('progress')}>Progress</button>
    </nav>
  );
}
