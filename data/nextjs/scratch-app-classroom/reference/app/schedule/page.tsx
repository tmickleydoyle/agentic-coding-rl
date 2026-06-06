'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function SchedulePage() {
  const { classroom } = useApp();
  const { schedule } = classroom;
  const formatted = `${schedule.days.join(', ')} ${schedule.startTime} - ${schedule.endTime}`;
  return (
    <div data-testid="schedule-page">
      <h2>Schedule</h2>
      <p data-testid="schedule-days">{schedule.days.join(', ')}</p>
      <p data-testid="schedule-time">{schedule.startTime} - {schedule.endTime}</p>
      <p data-testid="schedule-formatted">{formatted}</p>
    </div>
  );
}
