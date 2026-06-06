import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <div data-testid="dashboard-page"><h1>Dashboard</h1></div>}
      {route === "/tenants" && (
        <div data-testid="tenants-page">
          <h1>Tenants</h1>
          <input data-testid="tenant-name-input" placeholder="Name" />
          <input data-testid="tenant-unit-input" placeholder="Unit" />
          <input data-testid="tenant-rent-input" placeholder="Monthly Rent" type="number" />
          <input data-testid="tenant-lease-start-input" placeholder="Lease Start" />
          <input data-testid="tenant-lease-end-input" placeholder="Lease End" />
          <button data-testid="add-tenant-btn">Add Tenant</button>
          <ul data-testid="tenant-list"></ul>
        </div>
      )}
      {route === "/payments" && (
        <div data-testid="payments-page">
          <h1>Payments</h1>
          <select data-testid="payment-tenant-select"><option value="">Select Tenant</option></select>
          <input data-testid="payment-amount-input" placeholder="Amount" type="number" />
          <input data-testid="payment-date-input" placeholder="Date" />
          <input data-testid="payment-month-input" placeholder="Month (YYYY-MM)" />
          <button data-testid="add-payment-btn">Add Payment</button>
          <input data-testid="filter-month-input" placeholder="Filter by month" />
          <ul data-testid="payment-list"></ul>
        </div>
      )}
      {route === "/settings" && <div data-testid="settings-page"><h1>Settings</h1><p data-testid="settings-info">Property settings and configuration</p></div>}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}
