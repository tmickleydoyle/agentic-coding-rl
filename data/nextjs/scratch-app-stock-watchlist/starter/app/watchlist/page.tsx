'use client'
import React from 'react';
export function WatchlistPage() {
  return (
    <main data-testid="watchlist-page">
      <h2>Watchlist</h2>
      <div data-testid="add-stock-form">
        <input data-testid="stock-ticker-input" placeholder="Ticker" />
        <input data-testid="stock-name-input" placeholder="Company name" />
        <input data-testid="stock-price-input" type="number" placeholder="Price" />
        <input data-testid="stock-quantity-input" type="number" placeholder="Quantity" />
        <button data-testid="add-stock-btn">Add Stock</button>
      </div>
      <ul data-testid="stocks-list" />
    </main>
  );
}
