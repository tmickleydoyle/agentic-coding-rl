import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Transaction } from "../../lib/types";

export function TransactionsPage() {
  const { transactions, addTransaction } = useApp();
  const [ticker, setTicker] = useState("");
  const [type, setType] = useState<"buy"|"sell">("buy");
  const [shares, setShares] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");

  function handleAdd() {
    const s = parseFloat(shares);
    const p = parseFloat(price);
    if (!ticker || isNaN(s) || isNaN(p) || !date) return;
    addTransaction({ id: `t-${Date.now()}`, ticker: ticker.toUpperCase(), type, shares: s, price: p, date });
    setTicker(""); setShares(""); setPrice(""); setDate("");
  }

  return (
    <div data-testid="transactions-page">
      <h1>Transactions</h1>
      <div data-testid="add-transaction-form">
        <input data-testid="tx-ticker" value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="Ticker" />
        <select data-testid="tx-type" value={type} onChange={(e) => setType(e.target.value as "buy"|"sell")}>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <input data-testid="tx-shares" type="number" value={shares} onChange={(e) => setShares(e.target.value)} placeholder="Shares" />
        <input data-testid="tx-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
        <input data-testid="tx-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button data-testid="add-tx-btn" onClick={handleAdd}>Add Transaction</button>
      </div>
      <ul data-testid="transaction-list">
        {transactions.map((t) => (
          <li key={t.id} data-testid={`transaction-${t.id}`}>
            <span data-testid={`tx-ticker-${t.id}`}>{t.ticker}</span>
            <span data-testid={`tx-type-${t.id}`}>{t.type}</span>
            <span data-testid={`tx-shares-${t.id}`}>{t.shares}</span>
            <span data-testid={`tx-price-${t.id}`}>${t.price.toFixed(2)}</span>
            <span data-testid={`tx-date-${t.id}`}>{t.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
