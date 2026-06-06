'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { student, courses, navigate } = useApp();
  const enrolledCount = courses.filter((c) => c.enrolled).length;
  return (
    <div data-testid="home-page">
      <h1 data-testid="welcome-msg">Welcome, {student.name}</h1>
      <p data-testid="enrolled-count">Enrolled: {enrolledCount}</p>
      <button data-testid="btn-courses" onClick={() => navigate('courses')}>My Courses</button>
      <button data-testid="btn-progress" onClick={() => navigate('progress')}>View Progress</button>
    </div>
  );
}
