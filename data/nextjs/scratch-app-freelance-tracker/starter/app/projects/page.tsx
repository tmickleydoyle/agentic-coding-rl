'use client';
import React from 'react';

export function ProjectsPage() {
  return (
    <div>
      <h2>Projects</h2>
      <form data-testid="project-add-form">
        <input data-testid="project-title-input" placeholder="Title" />
        <select data-testid="project-client-select"><option value="">Select client</option></select>
        <input data-testid="project-rate-input" type="number" placeholder="Hourly rate" />
        <input data-testid="project-hours-input" type="number" placeholder="Hours logged" />
        <button data-testid="project-submit" type="submit">Add Project</button>
      </form>
      <ul data-testid="project-list"></ul>
    </div>
  );
}
