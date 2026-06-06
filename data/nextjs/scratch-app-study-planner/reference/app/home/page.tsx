'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { sessions, subjects, navigate } = useApp();
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date === today);
  const todayMinutes = todaySessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <main data-testid="home-page">
      <h1>Study Planner</h1>
      <section data-testid="today-summary">
        <p data-testid="today-minutes">Today: {todayMinutes} minutes studied</p>
        <p data-testid="today-session-count">{todaySessions.length} session(s) today</p>
      </section>
      <section>
        <p data-testid="subject-count">Subjects: {subjects.length}</p>
        <p data-testid="total-session-count">Total sessions: {sessions.length}</p>
      </section>
      <button data-testid="go-to-sessions" onClick={() => navigate('sessions')}>
        Log a Session
      </button>
    </main>
  );
}
