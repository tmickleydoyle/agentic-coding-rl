'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { course, modules, lessons, setCourse, navigate } = useApp();

  async function handlePublish() {
    const res = await fetch('/api/courses?type=publish', { method: 'PATCH' });
    if (res.ok) { const updated = await res.json(); setCourse(updated); }
  }

  return (
    <div data-testid="home-page">
      <h1 data-testid="course-title">{course.title}</h1>
      <p data-testid="course-description">{course.description}</p>
      <span data-testid="publish-badge">{course.published ? 'Published' : 'Draft'}</span>
      <p data-testid="module-count">Modules: {modules.length}</p>
      <p data-testid="lesson-count">Lessons: {lessons.length}</p>
      <button data-testid="btn-modules" onClick={() => navigate('modules')}>Edit Modules</button>
      <button data-testid="btn-lessons" onClick={() => navigate('lessons')}>Edit Lessons</button>
      <button data-testid="publish-btn" onClick={handlePublish}>Publish Course</button>
    </div>
  );
}
