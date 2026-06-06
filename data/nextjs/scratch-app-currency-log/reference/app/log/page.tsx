import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function LogPage() {
  const { exchanges } = useApp();
  return (
    <div data-testid="log-page">
      <h2>Exchange Log</h2>
      {exchanges.map((e) => (
        <div key={e.id} data-testid="exchange-card">
          <span data-testid="exchange-from">{e.amountFrom} {e.fromCurrency}</span>
          <span data-testid="exchange-to">{e.amountTo} {e.toCurrency}</span>
          <span data-testid="exchange-date">{e.date}</span>
          <span data-testid="exchange-location">{e.location}</span>
          <span data-testid="exchange-fee">{e.fee}</span>
        </div>
      ))}
    </div>
  );
}
