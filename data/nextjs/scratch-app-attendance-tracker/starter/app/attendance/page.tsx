'use client'
import React from 'react';
export function AttendancePage() {
  return (
    <div data-testid="attendance-page">
      <h2>Mark Attendance</h2>
      <input data-testid="date-input" type="date" />
      <ul data-testid="attendance-list"></ul>
      <button data-testid="save-attendance-btn">Save Attendance</button>
    </div>
  );
}
