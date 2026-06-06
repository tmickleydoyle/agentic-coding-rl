'use client';
import React from 'react';

export function ArticlesPage() {
  return (
    <div data-testid="articles-page">
      <h1>Articles</h1>
      <input data-testid="search-input" placeholder="Search..." />
    </div>
  );
}
