'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HistoryPage() {
  const { history, stocks } = useApp();
  const getTickerById = (id: string) => stocks.find(s => s.id === id)?.ticker ?? id;
  return (
    <main data-testid="history-page">
      <h2>Price History</h2>
      {history.length === 0
        ? <p data-testid="no-history-msg">No price updates yet</p>
        : (
          <ul data-testid="history-list">
            {history.map(h => (
              <li key={h.id} data-testid={`history-item-${h.id}`}>
                <span data-testid={`history-ticker-${h.id}`}>{getTickerById(h.stockId)}</span>
                <span data-testid={`history-price-${h.id}`}>${h.price.toFixed(2)}</span>
                <span data-testid={`history-time-${h.id}`}>{h.timestamp}</span>
              </li>
            ))}
          </ul>
        )
      }
    </main>
  );
}
