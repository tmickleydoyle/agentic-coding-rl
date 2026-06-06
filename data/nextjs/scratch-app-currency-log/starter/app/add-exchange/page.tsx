import React from "react";

export default function AddExchangePage() {
  return (
    <div data-testid="add-exchange-page">
      <input data-testid="input-date" type="date" />
      <input data-testid="input-from-currency" />
      <input data-testid="input-to-currency" />
      <input data-testid="input-amount-from" type="number" />
      <input data-testid="input-amount-to" type="number" />
      <input data-testid="input-location" />
      <input data-testid="input-fee" type="number" />
      <button data-testid="submit-exchange">Save Exchange</button>
    </div>
  );
}
