'use client'
import React from 'react';
import { useApp } from './AppStateProvider';
export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home" data-active="false" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-attendance" data-active="false" onClick={() => navigate('attendance')}>Attendance</button>
      <button data-testid="nav-students" data-active="false" onClick={() => navigate('students')}>Students</button>
      <button data-testid="nav-summary" data-active="false" onClick={() => navigate('summary')}>Summary</button>
    </nav>
  );
}
