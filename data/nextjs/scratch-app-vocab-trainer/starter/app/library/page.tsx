'use client'
import React from 'react';
export function LibraryPage() {
  return (
    <main data-testid="library-page">
      <h2>Word Library</h2>
      <div data-testid="add-word-form">
        <input data-testid="word-term-input" placeholder="Term" />
        <input data-testid="word-definition-input" placeholder="Definition" />
        <input data-testid="word-category-input" placeholder="Category" />
        <button data-testid="add-word-btn">Add Word</button>
      </div>
      <div data-testid="filter-section">
        <select data-testid="category-filter"><option value="All">All</option></select>
      </div>
      <ul data-testid="words-list" />
    </main>
  );
}
