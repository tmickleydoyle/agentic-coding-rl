'use client'
import React from 'react';
export function SettingsPage() {
  return (
    <main data-testid="settings-page">
      <h2>Settings</h2>
      <input data-testid="settings-name-input" />
      <select data-testid="settings-duration-select">
        <option value="15">15s</option>
        <option value="30">30s</option>
        <option value="60">60s</option>
      </select>
      <button data-testid="save-settings-btn">Save</button>
      <p data-testid="current-name">Name: Anonymous</p>
      <p data-testid="current-duration">Duration: 30s</p>
    </main>
  );
}
