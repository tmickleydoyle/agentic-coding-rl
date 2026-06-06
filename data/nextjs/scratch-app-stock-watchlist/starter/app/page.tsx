'use client'
import React from 'react';
import { AppStateProvider } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';

export default function App() {
  return (
    <AppStateProvider>
      <div data-testid="app" data-theme="light">
        <NavBar />
        <main data-testid="home-page">
          <h1>Stock Watchlist</h1>
          <p data-testid="stock-count">0 stock(s) watched</p>
          <p data-testid="active-alerts">0 active alert(s)</p>
          <p data-testid="portfolio-value">$0.00</p>
        </main>
      </div>
    </AppStateProvider>
  );
}
