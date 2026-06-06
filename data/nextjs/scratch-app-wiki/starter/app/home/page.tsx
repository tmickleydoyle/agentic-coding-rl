'use client';
import React from 'react';

export function HomePage() {
  return (
    <div data-testid="home-page">
      <h1>Wiki</h1>
      <div data-testid="stat-articles">Articles: 0</div>
      <div data-testid="recent-list"></div>
    </div>
  );
}
