'use client'
import React from 'react';

export function GradesPage() {
  return (
    <div data-testid="grades-page">
      <h2>Grades</h2>
      <div data-testid="add-grade-form">
        <select data-testid="grade-student-select"><option value="">Select student</option></select>
        <input data-testid="grade-subject-input" placeholder="Subject" />
        <input data-testid="grade-score-input" type="number" placeholder="Score" />
        <button data-testid="add-grade-btn">Add Grade</button>
      </div>
      <ul data-testid="grade-list"></ul>
    </div>
  );
}
