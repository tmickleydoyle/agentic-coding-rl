'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function CoursesPage() {
  const { courses, setCourses } = useApp();

  async function handleEnroll(id: number) {
    const res = await fetch('/api/portal?type=enroll', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId: id }) });
    if (res.ok) setCourses(courses.map((c) => c.id === id ? { ...c, enrolled: true } : c));
  }

  async function handleDrop(id: number) {
    const res = await fetch('/api/portal?type=drop', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId: id }) });
    if (res.ok) setCourses(courses.map((c) => c.id === id ? { ...c, enrolled: false } : c));
  }

  return (
    <div data-testid="courses-page">
      <h2>Courses</h2>
      <ul data-testid="course-list">
        {courses.map((c) => (
          <li key={c.id} data-testid={`course-${c.id}`}>
            <span data-testid={`course-title-${c.id}`}>{c.title}</span>
            <span data-testid={`course-instructor-${c.id}`}>{c.instructor}</span>
            <span data-testid={`course-credits-${c.id}`}>{c.credits}</span>
            <span data-testid={`course-status-${c.id}`}>{c.enrolled ? 'Enrolled' : 'Available'}</span>
            {c.enrolled
              ? <button data-testid={`drop-${c.id}`} onClick={() => handleDrop(c.id)}>Drop</button>
              : <button data-testid={`enroll-${c.id}`} onClick={() => handleEnroll(c.id)}>Enroll</button>
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
