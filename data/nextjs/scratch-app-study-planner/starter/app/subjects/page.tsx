'use client'
import React from 'react';

export function SubjectsPage() {
  return (
    <main data-testid="subjects-page">
      <h2>Subjects</h2>
      <div data-testid="add-subject-form">
        <input data-testid="subject-name-input" placeholder="Subject name" />
        <input data-testid="subject-color-input" type="color" />
        <button data-testid="add-subject-btn">Add Subject</button>
      </div>
      <ul data-testid="subjects-list" />
    </main>
  );
}
