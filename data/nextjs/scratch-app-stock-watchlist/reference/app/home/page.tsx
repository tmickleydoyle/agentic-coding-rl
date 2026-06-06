'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { stocks, alerts } = useApp();
  const totalValue = stocks.reduce((s, st) => s + st.price * st.quantity, 0);
  const activeAlerts = alerts.filter(a => !a.triggered).length;
  return (
    <main data-testid="home-page">
      <h1>Stock Watchlist</h1>
      <p data-testid="stock-count">{stocks.length} stock(s) watched</p>
      <p data-testid="active-alerts">{activeAlerts} active alert(s)</p>
      <p data-testid="portfolio-value">${totalValue.toFixed(2)}</p>
    </main>
  );
}
