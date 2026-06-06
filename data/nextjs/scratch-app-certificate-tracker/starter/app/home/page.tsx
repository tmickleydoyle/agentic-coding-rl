'use client'
import React from 'react';
export function HomePage() {
  return (
    <div data-testid="home-page">
      <h1 data-testid="app-title">Certificate Tracker</h1>
      <p data-testid="total-certificates">Certificates: 0</p>
      <p data-testid="total-skills">Skills: 0</p>
      <button data-testid="btn-certificates">View Certificates</button>
      <button data-testid="btn-skills">Manage Skills</button>
    </div>
  );
}
