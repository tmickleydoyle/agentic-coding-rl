'use client';
import React from 'react';

export function HomePage() {
  return (
    <div data-testid="home-page">
      <h1>Forum</h1>
      <div data-testid="stat-threads">Threads: 0</div>
      <div data-testid="stat-replies">Replies: 0</div>
      <div data-testid="stat-users">Active Users: 0</div>
    </div>
  );
}
