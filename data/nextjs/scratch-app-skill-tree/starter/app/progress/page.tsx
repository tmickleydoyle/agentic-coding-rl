'use client'
import React from 'react';
export function ProgressPage() {
  return (
    <div data-testid="progress-page">
      <h2>Progress</h2>
      <p data-testid="overall-pct">Overall: 0%</p>
      <div data-testid="completed-list"></div>
      <div data-testid="inprogress-list"></div>
      <div data-testid="category-breakdown"></div>
    </div>
  );
}
