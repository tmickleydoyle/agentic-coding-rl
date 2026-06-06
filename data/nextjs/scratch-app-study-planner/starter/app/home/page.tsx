'use client'
import React from 'react';

export function HomePage() {
  return (
    <main data-testid="home-page">
      <h1>Study Planner</h1>
      <section data-testid="today-summary">
        <p data-testid="today-minutes">Today: 0 minutes studied</p>
        <p data-testid="today-session-count">0 session(s) today</p>
      </section>
      <section>
        <p data-testid="subject-count">Subjects: 0</p>
        <p data-testid="total-session-count">Total sessions: 0</p>
      </section>
      <button data-testid="go-to-sessions">Log a Session</button>
    </main>
  );
}
