'use client';
import React from 'react';
export function LogPage() {
  return <div><h2>Activity Log</h2>
    <form data-testid="log-add-form">
      <select data-testid="log-bed-select"><option value="">Select bed</option></select>
      <input data-testid="log-action-input" placeholder="Action" />
      <input data-testid="log-date-input" type="date" />
      <input data-testid="log-notes-input" placeholder="Notes" />
      <button data-testid="log-submit" type="submit">Add Entry</button>
    </form>
    <ul data-testid="log-list"></ul>
  </div>;
}
