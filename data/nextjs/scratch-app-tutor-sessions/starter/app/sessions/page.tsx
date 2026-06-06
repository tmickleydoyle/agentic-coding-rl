'use client'
import React from 'react';
export function SessionsPage() {
  return (
    <div data-testid="sessions-page">
      <h2>Sessions</h2>
      <div data-testid="filter-buttons">
        <button data-testid="filter-all">All</button>
        <button data-testid="filter-scheduled">Scheduled</button>
        <button data-testid="filter-completed">Completed</button>
      </div>
      <ul data-testid="session-list"></ul>
    </div>
  );
}
