'use client'
import React from 'react';
export function ChartsPage() {
  return (
    <main data-testid="charts-page">
      <h2>Statistics</h2>
      <p data-testid="min-temp">Min: 0</p>
      <p data-testid="max-temp">Max: 0</p>
      <p data-testid="most-common-condition">none</p>
      <ul data-testid="condition-stats" />
    </main>
  );
}
