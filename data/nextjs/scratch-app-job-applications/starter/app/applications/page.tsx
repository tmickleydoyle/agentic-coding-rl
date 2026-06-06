'use client';
import React from 'react';

export function ApplicationsPage() {
  return (
    <div>
      <h2>Applications</h2>
      <form data-testid="app-add-form">
        <input data-testid="app-company-input" placeholder="Company" />
        <input data-testid="app-role-input" placeholder="Role" />
        <input data-testid="app-date-input" type="date" />
        <input data-testid="app-url-input" placeholder="URL" />
        <button data-testid="app-submit" type="submit">Add</button>
      </form>
      <ul data-testid="app-list"></ul>
    </div>
  );
}
