'use client'
import React from 'react';
export function PreviewPage() {
  return (
    <div data-testid="preview-page">
      <h2>Preview</h2>
      <p data-testid="total-duration">Total: 0 min</p>
      <ul data-testid="preview-module-list"></ul>
    </div>
  );
}
