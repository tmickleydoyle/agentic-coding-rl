'use client';
import React from 'react';

export function NewArticlePage() {
  return (
    <div data-testid="new-article-page">
      <h1>New Article</h1>
      <input data-testid="title-input" placeholder="Title" />
      <textarea data-testid="body-input" placeholder="Body" />
      <input data-testid="tags-input" placeholder="Tags (comma-separated)" />
      <input data-testid="author-input" placeholder="Author" />
      <button data-testid="submit-btn">Create Article</button>
    </div>
  );
}
