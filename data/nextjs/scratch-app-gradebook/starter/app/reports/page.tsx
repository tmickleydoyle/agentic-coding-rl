'use client'
import React from 'react';

export function ReportsPage() {
  return (
    <div data-testid="reports-page">
      <h2>Reports</h2>
      <p data-testid="class-average">Class Average: N/A</p>
      <ul data-testid="report-list"></ul>
    </div>
  );
}
