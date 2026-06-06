'use client';
import React from 'react';

export function SubmitPage() {
  return (
    <div data-testid="submit-page">
      <h1>Submit Link</h1>
      <input data-testid="title-input" placeholder="Title" />
      <input data-testid="url-input" placeholder="URL" />
      <select data-testid="category-select">
        <option value="News">News</option>
        <option value="Tech">Tech</option>
        <option value="Fun">Fun</option>
        <option value="Other">Other</option>
      </select>
      <input data-testid="submitter-input" placeholder="Your name" />
      <button data-testid="submit-btn">Submit</button>
    </div>
  );
}
