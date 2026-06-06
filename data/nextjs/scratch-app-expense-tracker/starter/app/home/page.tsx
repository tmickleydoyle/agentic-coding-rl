'use client';
import React from 'react';

export function HomePage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <span data-testid="total-spent">$0.00</span>
      <ul data-testid="recent-expenses"></ul>
    </div>
  );
}
