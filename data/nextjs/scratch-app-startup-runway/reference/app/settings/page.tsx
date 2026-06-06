import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function SettingsPage() {
  const { settings, setSettings } = useApp();
  const [cash, setCash] = useState(String(settings.cashBalance));
  const [target, setTarget] = useState(String(settings.targetRunway));
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const cashVal = parseFloat(cash);
    const targetVal = parseInt(target, 10);
    if (!isNaN(cashVal) && !isNaN(targetVal) && targetVal > 0) {
      setSettings({ cashBalance: cashVal, targetRunway: targetVal });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div data-testid="settings-page">
      <h1>Settings</h1>
      <label>
        Cash Balance ($)
        <input
          data-testid="settings-cash-input"
          type="number"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
        />
      </label>
      <label>
        Target Runway (months)
        <input
          data-testid="settings-target-input"
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
      </label>
      <button data-testid="settings-save-btn" onClick={handleSave}>Save</button>
      {saved && <div data-testid="settings-saved">Settings saved!</div>}
    </div>
  );
}
