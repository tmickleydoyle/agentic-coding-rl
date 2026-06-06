'use client'
import React from 'react';

export function SessionsPage() {
  return (
    <main data-testid="sessions-page">
      <h2>Study Sessions</h2>
      <div data-testid="add-session-form">
        <select data-testid="session-subject-select"><option value="">-- Select Subject --</option></select>
        <input data-testid="session-date-input" type="date" />
        <input data-testid="session-duration-input" type="number" placeholder="Minutes" />
        <input data-testid="session-notes-input" placeholder="Notes" />
        <button data-testid="add-session-btn">Add Session</button>
      </div>
      <ul data-testid="sessions-list" />
    </main>
  );
}
