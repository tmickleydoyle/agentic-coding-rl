'use client'
import React from 'react';
export function LogPage() {
  return (
    <main data-testid="log-page">
      <h2>Workout Log</h2>
      <div data-testid="add-log-form">
        <select data-testid="log-routine-select"><option value="">-- Select Routine --</option></select>
        <input data-testid="log-date-input" type="date" />
        <input data-testid="log-duration-input" type="number" placeholder="Minutes" />
        <input data-testid="log-notes-input" placeholder="Notes" />
        <button data-testid="add-log-btn">Log Session</button>
      </div>
      <ul data-testid="log-list" />
    </main>
  );
}
