'use client'
import React from 'react';

export function StudentsPage() {
  return (
    <div data-testid="students-page">
      <h2>Students</h2>
      <p data-testid="student-count">Total: 0</p>
      <ul data-testid="student-list"></ul>
      <div data-testid="add-student-form">
        <input data-testid="student-name-input" placeholder="Name" />
        <button data-testid="add-student-btn">Add Student</button>
      </div>
    </div>
  );
}
