'use client';
import React from 'react';

export function HomePage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div data-testid="dashboard-clients-count">0</div>
      <div data-testid="dashboard-projects-count">0</div>
      <div data-testid="dashboard-unpaid-total">0</div>
    </div>
  );
}
