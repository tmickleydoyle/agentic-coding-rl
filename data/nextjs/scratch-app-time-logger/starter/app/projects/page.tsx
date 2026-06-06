'use client';
import React from 'react';
export function ProjectsPage() {
  return <div><h1>Projects</h1>
    <input data-testid="project-name" /><input data-testid="project-color" type="color" />
    <button data-testid="add-project-btn">Add</button><ul></ul>
  </div>;
}
