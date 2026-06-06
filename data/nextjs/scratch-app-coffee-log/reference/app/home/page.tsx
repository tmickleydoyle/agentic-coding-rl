'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { beans, brews } = useApp();
  const avgRating = brews.length > 0
    ? (brews.reduce((sum, br) => sum + br.rating, 0) / brews.length).toFixed(1)
    : '0.0';
  return (
    <div>
      <h1>Coffee Log</h1>
      <div data-testid="dashboard-brew-count">{brews.length}</div>
      <div data-testid="dashboard-bean-count">{beans.length}</div>
      <div data-testid="dashboard-avg-rating">{avgRating}</div>
    </div>
  );
}
