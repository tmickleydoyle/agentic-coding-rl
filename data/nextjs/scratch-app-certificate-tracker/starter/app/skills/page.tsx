'use client'
import React from 'react';
export function SkillsPage() {
  return (
    <div data-testid="skills-page">
      <h2>Skills</h2>
      <ul data-testid="skill-list"></ul>
      <div data-testid="add-skill-form">
        <input data-testid="skill-name-input" placeholder="Skill name" />
        <input data-testid="skill-category-input" placeholder="Category" />
        <input data-testid="skill-hours-input" type="number" placeholder="Required hours" />
        <button data-testid="add-skill-btn">Add Skill</button>
      </div>
    </div>
  );
}
