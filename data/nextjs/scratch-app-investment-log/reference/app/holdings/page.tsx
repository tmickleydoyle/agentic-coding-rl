import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Holding } from "../../lib/types";

export function HoldingsPage() {
  const { holdings, addHolding, deleteHolding } = useApp();
  const [ticker, setTicker] = useState("");
  const [shares, setShares] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");

  function handleAdd() {
    const s = parseFloat(shares);
    const avg = parseFloat(avgPrice);
    const cur = parseFloat(currentPrice);
    if (!ticker || isNaN(s) || isNaN(avg) || isNaN(cur)) return;
    addHolding({ id: `h-${Date.now()}`, ticker: ticker.toUpperCase(), shares: s, avgPrice: avg, currentPrice: cur });
    setTicker(""); setShares(""); setAvgPrice(""); setCurrentPrice("");
  }

  return (
    <div data-testid="holdings-page">
      <h1>Holdings</h1>
      <div data-testid="add-holding-form">
        <input data-testid="holding-ticker" value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="Ticker" />
        <input data-testid="holding-shares" type="number" value={shares} onChange={(e) => setShares(e.target.value)} placeholder="Shares" />
        <input data-testid="holding-avg-price" type="number" value={avgPrice} onChange={(e) => setAvgPrice(e.target.value)} placeholder="Avg Price" />
        <input data-testid="holding-current-price" type="number" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} placeholder="Current Price" />
        <button data-testid="add-holding-btn" onClick={handleAdd}>Add Holding</button>
      </div>
      <ul data-testid="holding-list">
        {holdings.map((h) => (
          <li key={h.id} data-testid={`holding-${h.id}`}>
            <span data-testid={`holding-ticker-${h.id}`}>{h.ticker}</span>
            <span data-testid={`holding-shares-${h.id}`}>{h.shares}</span>
            <span data-testid={`holding-avg-${h.id}`}>${h.avgPrice.toFixed(2)}</span>
            <span data-testid={`holding-current-${h.id}`}>${h.currentPrice.toFixed(2)}</span>
            <button data-testid={`delete-holding-${h.id}`} onClick={() => deleteHolding(h.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
