'use client'
import React from 'react';

export function RosterPage() {
  return (
    <div data-testid="roster-page">
      <h2>Roster</h2>
      <p data-testid="student-count">Students: 0</p>
      <p data-testid="no-students">No students</p>
      <div data-testid="add-student-form">
        <input data-testid="student-name-input" placeholder="Student name" />
        <button data-testid="add-student-btn">Add Student</button>
      </div>
    </div>
  );
}
