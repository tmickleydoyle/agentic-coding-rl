'use client'
import React from 'react';
export function SummaryPage() {
  return (
    <div data-testid="summary-page">
      <h2>Summary</h2>
      <p data-testid="total-sessions">Sessions: 0</p>
      <ul data-testid="summary-list"></ul>
    </div>
  );
}
