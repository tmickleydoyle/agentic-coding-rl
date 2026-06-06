'use client'
import React from 'react';
export function PracticePage() {
  return (
    <main data-testid="practice-page">
      <h2>Practice</h2>
      <p data-testid="prompt-text">Type this text</p>
      <textarea data-testid="typing-input" rows={4} />
      <button data-testid="submit-typing-btn">Submit</button>
    </main>
  );
}
