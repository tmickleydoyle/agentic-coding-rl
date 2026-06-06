'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [name, setName] = useState(settings.name);
  const [duration, setDuration] = useState(String(settings.duration));

  const handleSave = () => {
    updateSettings({ name: name || 'Anonymous', duration: Number(duration) });
  };

  return (
    <main data-testid="settings-page">
      <h2>Settings</h2>
      <label>
        Display Name
        <input data-testid="settings-name-input" value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Test Duration
        <select data-testid="settings-duration-select" value={duration} onChange={e => setDuration(e.target.value)}>
          <option value="15">15s</option>
          <option value="30">30s</option>
          <option value="60">60s</option>
        </select>
      </label>
      <button data-testid="save-settings-btn" onClick={handleSave}>Save</button>
      <p data-testid="current-name">Name: {settings.name}</p>
      <p data-testid="current-duration">Duration: {settings.duration}s</p>
    </main>
  );
}
