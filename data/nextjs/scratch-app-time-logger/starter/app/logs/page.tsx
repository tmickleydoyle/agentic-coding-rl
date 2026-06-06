'use client';
import React from 'react';
export function LogsPage() {
  return <div><h1>Time Logs</h1>
    <select data-testid="log-project"></select>
    <input data-testid="log-description" /><input data-testid="log-hours" type="number" /><input data-testid="log-date" type="date" />
    <button data-testid="add-log-btn">Add</button>
    <table><tbody></tbody></table>
  </div>;
}
