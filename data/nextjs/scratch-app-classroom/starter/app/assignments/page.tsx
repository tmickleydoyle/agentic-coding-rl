'use client'
import React from 'react';

export function AssignmentsPage() {
  return (
    <div data-testid="assignments-page">
      <h2>Assignments</h2>
      <button data-testid="add-assignment-btn">Add Assignment</button>
      <p data-testid="no-assignments">No assignments</p>
    </div>
  );
}
