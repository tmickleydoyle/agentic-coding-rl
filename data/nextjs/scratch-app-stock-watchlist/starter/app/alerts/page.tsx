'use client'
import React from 'react';
export function AlertsPage() {
  return (
    <main data-testid="alerts-page">
      <h2>Price Alerts</h2>
      <div data-testid="add-alert-form">
        <select data-testid="alert-stock-select"><option value="">-- Select Stock --</option></select>
        <select data-testid="alert-condition-select"><option value="above">Above</option><option value="below">Below</option></select>
        <input data-testid="alert-price-input" type="number" placeholder="Target price" />
        <button data-testid="add-alert-btn">Add Alert</button>
      </div>
      <ul data-testid="alerts-list" />
    </main>
  );
}
