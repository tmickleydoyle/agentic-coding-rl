'use client';
import React from 'react';

export function HistoryPage() {
  return (
    <div data-testid="history-page">
      <p data-testid="no-player">No player selected</p>
      <h1 data-testid="history-player"></h1>
      <div data-testid="history-list"></div>
    </div>
  );
}
