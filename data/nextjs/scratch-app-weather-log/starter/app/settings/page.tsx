'use client'
import React from 'react';
export function SettingsPage() {
  return (
    <main data-testid="settings-page">
      <h2>Settings</h2>
      <select data-testid="unit-select"><option value="celsius">Celsius</option><option value="fahrenheit">Fahrenheit</option></select>
      <button data-testid="save-settings-btn">Save</button>
      <p data-testid="current-unit">Unit: celsius</p>
    </main>
  );
}
