'use client';
import React from 'react';

export function CreatePage() {
  return (
    <div data-testid="create-page">
      <h1>Create Poll</h1>
      <input data-testid="question-input" placeholder="Question" />
      <input data-testid="creator-input" placeholder="Creator" />
      <input data-testid="option-input-0" placeholder="Option 1" />
      <input data-testid="option-input-1" placeholder="Option 2" />
      <button data-testid="add-option-btn">Add Option</button>
      <button data-testid="submit-btn">Create Poll</button>
    </div>
  );
}
