import React from "react";
export function TransactionsPage() {
  return (
    <div data-testid="transactions-page">
      <div data-testid="add-transaction-form">
        <input data-testid="tx-ticker" />
        <select data-testid="tx-type"><option value="buy">Buy</option><option value="sell">Sell</option></select>
        <input data-testid="tx-shares" type="number" /><input data-testid="tx-price" type="number" />
        <input data-testid="tx-date" type="date" /><button data-testid="add-tx-btn">Add Transaction</button>
      </div>
      <ul data-testid="transaction-list"></ul>
    </div>
  );
}
