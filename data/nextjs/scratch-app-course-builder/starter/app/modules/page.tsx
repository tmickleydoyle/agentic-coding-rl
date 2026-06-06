'use client'
import React from 'react';
export function ModulesPage() {
  return (
    <div data-testid="modules-page">
      <h2>Modules</h2>
      <ul data-testid="module-list"></ul>
      <div data-testid="add-module-form">
        <input data-testid="module-title-input" placeholder="Module title" />
        <button data-testid="add-module-btn">Add Module</button>
      </div>
    </div>
  );
}
