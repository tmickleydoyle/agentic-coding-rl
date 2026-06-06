'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { progress, navigate } = useApp();
  const completed = progress.filter((p) => p.status === 'completed').length;
  const inProgress = progress.filter((p) => p.status === 'in_progress').length;
  return (
    <div data-testid="home-page">
      <h1 data-testid="app-title">Skill Tree</h1>
      <p data-testid="completed-count">Completed: {completed}</p>
      <p data-testid="inprogress-count">In Progress: {inProgress}</p>
      <button data-testid="btn-skills" onClick={() => navigate('skills')}>Browse Skills</button>
      <button data-testid="btn-paths" onClick={() => navigate('paths')}>Learning Paths</button>
    </div>
  );
}
