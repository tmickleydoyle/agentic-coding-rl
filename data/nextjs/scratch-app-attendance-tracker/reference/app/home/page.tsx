'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { students, navigate } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div data-testid="home-page">
      <h1 data-testid="app-title">Attendance Tracker</h1>
      <p data-testid="today-date">{today}</p>
      <p data-testid="total-students">Students: {students.length}</p>
      <button data-testid="btn-attendance" onClick={() => navigate('attendance')}>Mark Attendance</button>
      <button data-testid="btn-summary" onClick={() => navigate('summary')}>View Summary</button>
    </div>
  );
}
