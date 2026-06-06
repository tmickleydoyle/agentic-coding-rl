'use client';
import React from 'react';

export function SubscriptionsPage() {
  return (
    <div>
      <h2>Subscriptions</h2>
      <form data-testid="sub-add-form">
        <input data-testid="sub-name-input" placeholder="Name" />
        <input data-testid="sub-cost-input" type="number" placeholder="Monthly cost" />
        <input data-testid="sub-day-input" type="number" placeholder="Billing day" />
        <input data-testid="sub-category-input" placeholder="Category" />
        <select data-testid="sub-status-select">
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
        <button data-testid="sub-submit" type="submit">Add</button>
      </form>
      <ul data-testid="sub-list"></ul>
    </div>
  );
}
