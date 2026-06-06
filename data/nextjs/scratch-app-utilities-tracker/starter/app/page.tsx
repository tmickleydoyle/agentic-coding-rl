import React from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";

function Shell() {
  const { route } = useApp();
  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "/" && <div data-testid="dashboard-page"><h1>Dashboard</h1><div data-testid="total-due">0</div><div data-testid="unpaid-count">0</div><div data-testid="utility-count">0</div></div>}
      {route === "/utilities" && (
        <div data-testid="utilities-page">
          <h1>Utilities</h1>
          <input data-testid="utility-name-input" placeholder="Name" />
          <select data-testid="utility-type-select"><option value="electricity">Electricity</option></select>
          <input data-testid="utility-provider-input" placeholder="Provider" />
          <input data-testid="utility-account-input" placeholder="Account Number" />
          <button data-testid="add-utility-btn">Add Utility</button>
          <ul data-testid="utility-list"></ul>
        </div>
      )}
      {route === "/bills" && (
        <div data-testid="bills-page">
          <h1>Bills</h1>
          <select data-testid="bill-utility-select"><option value="">Select Utility</option></select>
          <input data-testid="bill-month-input" placeholder="Month (YYYY-MM)" />
          <input data-testid="bill-amount-input" placeholder="Amount" type="number" />
          <input data-testid="bill-duedate-input" placeholder="Due Date" />
          <button data-testid="add-bill-btn">Add Bill</button>
          <select data-testid="filter-utility-select"><option value="">All Utilities</option></select>
          <ul data-testid="bill-list"></ul>
        </div>
      )}
      {route === "/usage" && (
        <div data-testid="usage-page">
          <h1>Usage</h1>
          <select data-testid="usage-utility-select"><option value="">Select Utility</option></select>
          <input data-testid="usage-month-input" placeholder="Month (YYYY-MM)" />
          <input data-testid="usage-units-input" placeholder="Units" type="number" />
          <input data-testid="usage-reading-input" placeholder="Meter Reading" type="number" />
          <button data-testid="add-usage-btn">Add Reading</button>
          <ul data-testid="reading-list"></ul>
        </div>
      )}
      {route === "/reports" && <div data-testid="reports-page"><h1>Reports</h1><div data-testid="total-paid">0</div><div data-testid="total-unpaid">0</div></div>}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
