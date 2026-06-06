import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Snapshot } from "../../lib/types";

export function HistoryPage() {
  const { assets, liabilities, snapshots, addSnapshot } = useApp();
  const [date, setDate] = useState("");

  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.amount, 0);
  const currentNetWorth = totalAssets - totalLiabilities;

  function handleSnapshot() {
    if (!date) return;
    const s: Snapshot = { id: `s-${Date.now()}`, date, netWorth: currentNetWorth };
    addSnapshot(s);
    setDate("");
  }

  const sorted = [...snapshots].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div data-testid="history-page">
      <h1>Net Worth History</h1>
      <div data-testid="snapshot-form">
        <input data-testid="snapshot-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <span data-testid="snapshot-preview">${currentNetWorth.toFixed(2)}</span>
        <button data-testid="add-snapshot-btn" onClick={handleSnapshot}>Save Snapshot</button>
      </div>
      <ul data-testid="snapshot-list">
        {sorted.map((s) => (
          <li key={s.id} data-testid={`snapshot-${s.id}`}>
            <span data-testid={`snapshot-date-${s.id}`}>{s.date}</span>
            <span data-testid={`snapshot-nw-${s.id}`}>${s.netWorth.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
