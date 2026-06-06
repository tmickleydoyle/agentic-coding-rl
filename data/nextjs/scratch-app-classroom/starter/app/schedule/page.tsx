'use client'
import React from 'react';

export function SchedulePage() {
  return (
    <div data-testid="schedule-page">
      <h2>Schedule</h2>
      <p data-testid="schedule-days"></p>
      <p data-testid="schedule-time"></p>
      <p data-testid="schedule-formatted"></p>
    </div>
  );
}
