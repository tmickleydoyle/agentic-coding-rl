'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { entries, settings } = useApp();
  if (entries.length === 0) {
    return <main data-testid="home-page"><h1>Weather Log</h1><p data-testid="no-entries-msg">No entries yet</p></main>;
  }
  const toDisplay = (c: number) => settings.unit === 'fahrenheit' ? Math.round((c * 9/5 + 32) * 10) / 10 : c;
  const avg = entries.reduce((s, e) => s + e.temperature, 0) / entries.length;
  const hottest = entries.reduce((a, b) => a.temperature >= b.temperature ? a : b);
  const coldest = entries.reduce((a, b) => a.temperature <= b.temperature ? a : b);
  return (
    <main data-testid="home-page">
      <h1>Weather Log</h1>
      <p data-testid="total-entries">{entries.length} entries</p>
      <p data-testid="avg-temp">{toDisplay(Math.round(avg * 10) / 10)} avg</p>
      <p data-testid="hottest-day">{hottest.date}: {toDisplay(hottest.temperature)}</p>
      <p data-testid="coldest-day">{coldest.date}: {toDisplay(coldest.temperature)}</p>
    </main>
  );
}
