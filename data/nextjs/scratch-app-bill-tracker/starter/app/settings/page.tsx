import React from "react";
export function SettingsPage() {
  return (
    <div data-testid="settings-page">
      <span data-testid="active-total">$0.00</span>
      <span data-testid="all-total">$0.00</span>
      <ul data-testid="settings-bill-list"></ul>
    </div>
  );
}
