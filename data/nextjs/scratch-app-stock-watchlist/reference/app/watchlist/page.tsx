'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function WatchlistPage() {
  const { stocks, addStock, updateStockPrice, deleteStock } = useApp();
  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [newPrices, setNewPrices] = useState<Record<string, string>>({});

  const handleAdd = () => {
    if (!ticker.trim()) { setError('Ticker required'); return; }
    const p = parseFloat(price);
    const q = parseFloat(quantity);
    if (!p || p <= 0 || !q || q <= 0) { setError('Positive price and quantity required'); return; }
    const ok = addStock(ticker, name, p, q, 'USD');
    if (!ok) { setError('Ticker already in watchlist or invalid data'); return; }
    setTicker(''); setName(''); setPrice(''); setQuantity(''); setError('');
  };

  const handleUpdatePrice = (id: string) => {
    const p = parseFloat(newPrices[id] ?? '');
    if (isNaN(p) || p <= 0) return;
    updateStockPrice(id, p);
    setNewPrices(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <main data-testid="watchlist-page">
      <h2>Watchlist</h2>
      <div data-testid="add-stock-form">
        <input data-testid="stock-ticker-input" value={ticker} onChange={e => setTicker(e.target.value)} placeholder="Ticker" />
        <input data-testid="stock-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Company name" />
        <input data-testid="stock-price-input" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" />
        <input data-testid="stock-quantity-input" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Quantity" />
        <button data-testid="add-stock-btn" onClick={handleAdd}>Add Stock</button>
        {error && <span data-testid="stock-error">{error}</span>}
      </div>
      <ul data-testid="stocks-list">
        {stocks.map(s => (
          <li key={s.id} data-testid={`stock-item-${s.id}`}>
            <span data-testid={`stock-ticker-${s.id}`}>{s.ticker}</span>
            <span data-testid={`stock-name-${s.id}`}>{s.name}</span>
            <span data-testid={`stock-price-${s.id}`}>${s.price.toFixed(2)}</span>
            <input
              data-testid={`update-price-input-${s.id}`}
              type="number"
              value={newPrices[s.id] ?? ''}
              onChange={e => setNewPrices(prev => ({ ...prev, [s.id]: e.target.value }))}
              placeholder="New price"
            />
            <button data-testid={`update-price-btn-${s.id}`} onClick={() => handleUpdatePrice(s.id)}>Update</button>
            <button data-testid={`delete-stock-${s.id}`} onClick={() => deleteStock(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
