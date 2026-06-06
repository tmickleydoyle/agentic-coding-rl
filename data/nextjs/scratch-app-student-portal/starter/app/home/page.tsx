'use client'
import React from 'react';

export function HomePage() {
  return (
    <div data-testid="home-page">
      <h1 data-testid="welcome-msg">Welcome</h1>
      <p data-testid="enrolled-count">Enrolled: 0</p>
      <button data-testid="btn-courses">My Courses</button>
      <button data-testid="btn-progress">View Progress</button>
    </div>
  );
}
