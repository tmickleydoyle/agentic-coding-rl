import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function SettingsPage() {
  const { bills, toggleBill } = useApp();
  const activeTotal = bills.filter((b) => b.isActive).reduce((sum, b) => sum + b.amount, 0);
  const allTotal = bills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div data-testid="settings-page">
      <h1>Settings</h1>
      <span data-testid="active-total">${activeTotal.toFixed(2)}</span>
      <span data-testid="all-total">${allTotal.toFixed(2)}</span>
      <ul data-testid="settings-bill-list">
        {bills.map((b) => (
          <li key={b.id} data-testid={`settings-bill-${b.id}`}>
            <span data-testid={`settings-name-${b.id}`}>{b.name}</span>
            <span data-testid={`settings-status-${b.id}`}>{b.isActive ? "active" : "inactive"}</span>
            <button data-testid={`settings-toggle-${b.id}`} onClick={() => toggleBill(b.id)}>
              {b.isActive ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
