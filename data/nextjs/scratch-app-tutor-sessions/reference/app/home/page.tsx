'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { sessions, navigate } = useApp();
  const upcoming = sessions.filter((s) => s.status === 'scheduled').length;
  return (
    <div data-testid="home-page">
      <h1 data-testid="app-title">Tutor Sessions</h1>
      <p data-testid="total-sessions">Total: {sessions.length}</p>
      <p data-testid="upcoming-sessions">Upcoming: {upcoming}</p>
      <button data-testid="btn-tutors" onClick={() => navigate('tutors')}>Browse Tutors</button>
      <button data-testid="btn-sessions" onClick={() => navigate('sessions')}>My Sessions</button>
    </div>
  );
}
