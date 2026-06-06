'use client'
import React from 'react';
export function LessonsPage() {
  return (
    <div data-testid="lessons-page">
      <h2>Lessons</h2>
      <select data-testid="lesson-filter"><option value="all">All</option></select>
      <ul data-testid="lesson-list"></ul>
      <div data-testid="add-lesson-form">
        <select data-testid="lesson-module-select"><option value="">Select module</option></select>
        <input data-testid="lesson-title-input" placeholder="Lesson title" />
        <select data-testid="lesson-type-select"><option value="video">Video</option></select>
        <input data-testid="lesson-duration-input" type="number" placeholder="Duration" />
        <button data-testid="add-lesson-btn">Add Lesson</button>
      </div>
    </div>
  );
}
