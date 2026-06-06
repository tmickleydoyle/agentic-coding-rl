'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function AlertsPage() {
  const { stocks, alerts, addAlert, deleteAlert } = useApp();
  const [stockId, setStockId] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  const handleAdd = () => {
    if (!stockId || !targetPrice) return;
    addAlert(stockId, parseFloat(targetPrice), condition);
    setTargetPrice('');
  };

  const getTickerById = (id: string) => stocks.find(s => s.id === id)?.ticker ?? id;

  return (
    <main data-testid="alerts-page">
      <h2>Price Alerts</h2>
      <div data-testid="add-alert-form">
        <select data-testid="alert-stock-select" value={stockId} onChange={e => setStockId(e.target.value)}>
          <option value="">-- Select Stock --</option>
          {stocks.map(s => <option key={s.id} value={s.id}>{s.ticker}</option>)}
        </select>
        <select data-testid="alert-condition-select" value={condition} onChange={e => setCondition(e.target.value as 'above' | 'below')}>
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>
        <input data-testid="alert-price-input" type="number" value={targetPrice} onChange={e => setTargetPrice(e.target.value)} placeholder="Target price" />
        <button data-testid="add-alert-btn" onClick={handleAdd}>Add Alert</button>
      </div>
      <ul data-testid="alerts-list">
        {alerts.map(a => (
          <li key={a.id} data-testid={`alert-item-${a.id}`}>
            <span data-testid={`alert-ticker-${a.id}`}>{getTickerById(a.stockId)}</span>
            <span data-testid={`alert-condition-${a.id}`}>{a.condition}</span>
            <span data-testid={`alert-price-${a.id}`}>${a.targetPrice}</span>
            <span data-testid={`alert-triggered-${a.id}`}>{a.triggered ? 'Triggered' : 'Active'}</span>
            <button data-testid={`delete-alert-${a.id}`} onClick={() => deleteAlert(a.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
