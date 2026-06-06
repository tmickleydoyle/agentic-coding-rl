'use client'
import React from 'react';
import { useApp } from './AppStateProvider';

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav data-testid="navbar">
      <button data-testid="nav-home" data-active="false" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-students" data-active="false" onClick={() => navigate('students')}>Students</button>
      <button data-testid="nav-grades" data-active="false" onClick={() => navigate('grades')}>Grades</button>
      <button data-testid="nav-reports" data-active="false" onClick={() => navigate('reports')}>Reports</button>
    </nav>
  );
}
