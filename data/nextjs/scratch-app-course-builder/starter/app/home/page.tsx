'use client'
import React from 'react';
export function HomePage() {
  return (
    <div data-testid="home-page">
      <h1 data-testid="course-title"></h1>
      <p data-testid="course-description"></p>
      <span data-testid="publish-badge">Draft</span>
      <p data-testid="module-count">Modules: 0</p>
      <p data-testid="lesson-count">Lessons: 0</p>
      <button data-testid="btn-modules">Edit Modules</button>
      <button data-testid="btn-lessons">Edit Lessons</button>
      <button data-testid="publish-btn">Publish Course</button>
    </div>
  );
}
