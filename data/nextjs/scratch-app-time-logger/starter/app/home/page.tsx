'use client';
import React from 'react';
export function HomePage() {
  return <div><h1>Time Logger</h1>
    <span data-testid="total-hours">0.0</span>
    <span data-testid="project-count">0</span>
    <ul data-testid="recent-logs"></ul>
  </div>;
}
