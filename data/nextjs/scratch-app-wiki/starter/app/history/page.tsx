'use client';
import React from 'react';

export function HistoryPage() {
  return (
    <div data-testid="history-page">
      <h1 data-testid="history-title"></h1>
      <p data-testid="history-body"></p>
      <div data-testid="revisions-list"></div>
    </div>
  );
}
