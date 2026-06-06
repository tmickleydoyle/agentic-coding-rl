'use client'
import React from 'react';

export function HomePage() {
  return (
    <div data-testid="home-page">
      <h1 data-testid="app-title">Gradebook</h1>
      <p data-testid="total-students">Students: 0</p>
      <p data-testid="total-grades">Grades: 0</p>
      <button data-testid="btn-students">Manage Students</button>
      <button data-testid="btn-grades">Enter Grades</button>
    </div>
  );
}
