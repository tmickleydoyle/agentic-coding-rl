'use client'
import React from 'react';
export function HomePage() {
  return (
    <div data-testid="home-page">
      <h1 data-testid="app-title">Skill Tree</h1>
      <p data-testid="completed-count">Completed: 0</p>
      <p data-testid="inprogress-count">In Progress: 0</p>
      <button data-testid="btn-skills">Browse Skills</button>
      <button data-testid="btn-paths">Learning Paths</button>
    </div>
  );
}
