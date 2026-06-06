import React from "react";

export function LogDosePage() {
  return (
    <div>
      <h1>Log Dose</h1>
      <form data-testid="log-dose-form">
        <select data-testid="select-supplement"></select>
        <input data-testid="input-time" type="time" defaultValue="08:00" />
        <button type="submit" data-testid="log-btn">Log Dose</button>
      </form>
      <h2>Today's Doses</h2>
    </div>
  );
}
