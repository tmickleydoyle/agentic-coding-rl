'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [unit, setUnit] = useState(settings.unit);

  const handleSave = () => {
    updateSettings({ unit });
  };

  return (
    <main data-testid="settings-page">
      <h2>Settings</h2>
      <label>
        Temperature Unit
        <select data-testid="unit-select" value={unit} onChange={e => setUnit(e.target.value as 'celsius' | 'fahrenheit')}>
          <option value="celsius">Celsius</option>
          <option value="fahrenheit">Fahrenheit</option>
        </select>
      </label>
      <button data-testid="save-settings-btn" onClick={handleSave}>Save</button>
      <p data-testid="current-unit">Unit: {settings.unit}</p>
    </main>
  );
}
