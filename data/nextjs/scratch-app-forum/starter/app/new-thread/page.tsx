'use client';
import React from 'react';

export function NewThreadPage() {
  return (
    <div data-testid="new-thread-page">
      <h1>New Thread</h1>
      <input data-testid="title-input" placeholder="Title" />
      <textarea data-testid="body-input" placeholder="Body" />
      <select data-testid="category-select">
        <option value="General">General</option>
        <option value="Tech">Tech</option>
        <option value="Off-Topic">Off-Topic</option>
      </select>
      <button data-testid="submit-btn">Create Thread</button>
    </div>
  );
}
