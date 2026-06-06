'use client';
import React from 'react';
export function NotesPage() {
  return <div><h1>Notes</h1>
    <input data-testid="note-title" /><input data-testid="note-body" /><input data-testid="note-tags" />
    <button data-testid="add-note-btn">Add</button><ul></ul>
  </div>;
}
