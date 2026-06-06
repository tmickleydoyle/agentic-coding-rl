'use client';
import React from 'react';

export function HomePage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div data-testid="dashboard-total-count">0</div>
      <div data-testid="dashboard-active-count">0</div>
      <div data-testid="dashboard-monthly-cost">0.00</div>
    </div>
  );
}
