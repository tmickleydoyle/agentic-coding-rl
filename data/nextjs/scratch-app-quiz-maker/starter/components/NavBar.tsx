'use client';
import React from 'react';
import { useApp } from './AppStateProvider';
export function NavBar() {
  const { navigate } = useApp();
  return <nav>
    <button data-testid="nav-home" onClick={() => navigate('home')}>Home</button>
    <button data-testid="nav-quizzes" onClick={() => navigate('quizzes')}>Quizzes</button>
    <button data-testid="nav-create" onClick={() => navigate('create')}>Create</button>
    <button data-testid="nav-results" onClick={() => navigate('results')}>Results</button>
  </nav>;
}
