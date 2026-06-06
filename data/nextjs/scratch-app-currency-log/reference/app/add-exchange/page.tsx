import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import type { Exchange } from "../../lib/types";

let clientId = 100;

export default function AddExchangePage() {
  const { navigate, addExchange } = useApp();
  const [date, setDate] = useState("");
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [amountFrom, setAmountFrom] = useState(0);
  const [amountTo, setAmountTo] = useState(0);
  const [location, setLocation] = useState("");
  const [fee, setFee] = useState(0);
  const [error, setError] = useState("");

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (amountFrom <= 0 || amountTo <= 0) {
      setError("Amounts must be greater than 0");
      return;
    }
    const ex: Exchange = { id: String(++clientId), date, fromCurrency, toCurrency, amountFrom, amountTo, location, fee };
    addExchange(ex);
    navigate("/log");
  }

  return (
    <div data-testid="add-exchange-page">
      <h2>Add Exchange</h2>
      {error && <p data-testid="form-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input data-testid="input-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="input-from-currency" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} placeholder="From Currency" />
        <input data-testid="input-to-currency" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} placeholder="To Currency" />
        <input data-testid="input-amount-from" type="number" value={amountFrom} onChange={(e) => setAmountFrom(Number(e.target.value))} />
        <input data-testid="input-amount-to" type="number" value={amountTo} onChange={(e) => setAmountTo(Number(e.target.value))} />
        <input data-testid="input-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        <input data-testid="input-fee" type="number" value={fee} onChange={(e) => setFee(Number(e.target.value))} />
        <button type="submit" data-testid="submit-exchange">Save Exchange</button>
      </form>
    </div>
  );
}
