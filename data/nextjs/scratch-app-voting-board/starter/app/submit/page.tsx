'use client';
import React from 'react';

export function SubmitPage() {
  return (
    <div data-testid="submit-page">
      <h1>Submit Proposal</h1>
      <input data-testid="title-input" placeholder="Title" />
      <textarea data-testid="description-input" placeholder="Description" />
      <input data-testid="author-input" placeholder="Author" />
      <select data-testid="category-select">
        <option value="Feature">Feature</option>
        <option value="Bug Fix">Bug Fix</option>
        <option value="Improvement">Improvement</option>
        <option value="Other">Other</option>
      </select>
      <button data-testid="submit-btn">Submit</button>
    </div>
  );
}
