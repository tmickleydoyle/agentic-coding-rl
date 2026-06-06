'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { scores, navigate } = useApp();
  const sorted = [...scores].sort((a, b) => b.wpm - a.wpm);
  const best = sorted[0]?.wpm ?? 0;
  return (
    <main data-testid="home-page">
      <h1>Typing Practice</h1>
      <p data-testid="personal-best">Personal Best: {best} WPM</p>
      <p data-testid="tests-taken">{scores.length} tests taken</p>
      <button data-testid="start-practice-btn" onClick={() => navigate('practice')}>Start Practice</button>
    </main>
  );
}
