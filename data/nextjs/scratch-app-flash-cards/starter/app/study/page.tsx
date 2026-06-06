'use client'
import React from 'react';
export function StudyPage() {
  return (
    <main data-testid="study-page">
      <h2>Study</h2>
      <select data-testid="study-deck-select"><option value="">-- Select Deck --</option></select>
      <button data-testid="start-study-btn">Start</button>
    </main>
  );
}
