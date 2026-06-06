import React from "react";

export function LogWaterPage() {
  return (
    <div>
      <h1>Log Water</h1>
      <form data-testid="log-water-form">
        <input data-testid="input-cups" type="number" step="0.5" min="0.5" defaultValue={1} />
        <input data-testid="input-note" placeholder="Note" />
        <input data-testid="input-time" type="time" defaultValue="08:00" />
        <input data-testid="input-goal" type="number" defaultValue={8} />
        <button type="submit" data-testid="submit-btn">Log</button>
      </form>
    </div>
  );
}
