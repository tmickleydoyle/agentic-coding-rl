'use client';
import React from 'react';

export function HomePage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div data-testid="dashboard-total">0</div>
      <div data-testid="dashboard-applied-count">0</div>
      <div data-testid="dashboard-interview-count">0</div>
      <div data-testid="dashboard-offer-count">0</div>
      <div data-testid="dashboard-rejected-count">0</div>
      <div data-testid="dashboard-recent-company"></div>
    </div>
  );
}
