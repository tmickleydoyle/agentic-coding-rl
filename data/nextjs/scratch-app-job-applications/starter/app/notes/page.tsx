'use client';
import React from 'react';

export function NotesPage() {
  return (
    <div>
      <h2>Notes</h2>
      <form data-testid="note-add-form">
        <select data-testid="note-app-select"><option value="">Select application</option></select>
        <input data-testid="note-text-input" placeholder="Note text" />
        <button data-testid="note-submit" type="submit">Add</button>
      </form>
      <ul data-testid="note-list"></ul>
    </div>
  );
}
