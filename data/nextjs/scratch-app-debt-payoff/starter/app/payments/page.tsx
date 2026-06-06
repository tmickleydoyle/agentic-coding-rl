import React from "react";
export function PaymentsPage() {
  return (
    <div data-testid="payments-page">
      <div data-testid="add-payment-form">
        <select data-testid="payment-debt"><option value="">Select debt</option></select>
        <input data-testid="payment-amount" type="number" />
        <input data-testid="payment-date" type="date" />
        <button data-testid="add-payment-btn">Add Payment</button>
      </div>
      <ul data-testid="payment-list"></ul>
    </div>
  );
}
