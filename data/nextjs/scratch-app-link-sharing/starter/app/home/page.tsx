'use client';
import React from 'react';

export function HomePage() {
  return (
    <div data-testid="home-page">
      <h1>Link Sharing</h1>
      <div data-testid="stat-links">Links: 0</div>
      <div data-testid="stat-comments">Comments: 0</div>
      <div data-testid="stat-top">None</div>
    </div>
  );
}
