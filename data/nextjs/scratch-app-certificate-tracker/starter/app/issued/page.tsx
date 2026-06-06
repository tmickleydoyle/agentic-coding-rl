'use client'
import React from 'react';
export function IssuedPage() {
  return (
    <div data-testid="issued-page">
      <h2>Issued</h2>
      <p data-testid="unique-recipients">Recipients: 0</p>
      <select data-testid="category-filter"><option value="all">All</option></select>
      <ul data-testid="issued-list"></ul>
    </div>
  );
}
