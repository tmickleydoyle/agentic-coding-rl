'use client';
import React from 'react';

export function InvoicesPage() {
  return (
    <div>
      <h2>Invoices</h2>
      <form data-testid="invoice-add-form">
        <select data-testid="invoice-project-select"><option value="">Select project</option></select>
        <input data-testid="invoice-amount-input" type="number" placeholder="Amount (optional)" />
        <input data-testid="invoice-due-input" type="date" />
        <button data-testid="invoice-submit" type="submit">Add Invoice</button>
      </form>
      <ul data-testid="invoice-list"></ul>
    </div>
  );
}
