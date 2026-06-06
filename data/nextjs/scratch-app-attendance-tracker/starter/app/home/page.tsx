'use client'
import React from 'react';
export function HomePage() {
  return (
    <div data-testid="home-page">
      <h1 data-testid="app-title">Attendance Tracker</h1>
      <p data-testid="today-date"></p>
      <p data-testid="total-students">Students: 0</p>
      <button data-testid="btn-attendance">Mark Attendance</button>
      <button data-testid="btn-summary">View Summary</button>
    </div>
  );
}
