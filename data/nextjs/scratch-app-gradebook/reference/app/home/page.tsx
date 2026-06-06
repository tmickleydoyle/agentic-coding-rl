'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { students, grades, navigate } = useApp();
  return (
    <div data-testid="home-page">
      <h1 data-testid="app-title">Gradebook</h1>
      <p data-testid="total-students">Students: {students.length}</p>
      <p data-testid="total-grades">Grades: {grades.length}</p>
      <button data-testid="btn-students" onClick={() => navigate('students')}>Manage Students</button>
      <button data-testid="btn-grades" onClick={() => navigate('grades')}>Enter Grades</button>
    </div>
  );
}
