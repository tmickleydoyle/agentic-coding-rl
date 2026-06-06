'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { classroom, navigate } = useApp();
  return (
    <div data-testid="home-page">
      <h1 data-testid="class-name">{classroom.name}</h1>
      <p data-testid="teacher">{classroom.teacher}</p>
      <p data-testid="room">{classroom.room}</p>
      <p data-testid="period">Period {classroom.period}</p>
      <button data-testid="btn-roster" onClick={() => navigate('roster')}>View Roster</button>
      <button data-testid="btn-schedule" onClick={() => navigate('schedule')}>View Schedule</button>
    </div>
  );
}
