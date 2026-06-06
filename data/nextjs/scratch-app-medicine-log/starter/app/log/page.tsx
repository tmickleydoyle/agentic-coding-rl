'use client'
import React from 'react'
export function LogPage() {
  return <div><h1>Dose Log</h1>
    <ul data-testid="log-list"></ul>
    <form data-testid="add-log-form">
      <select data-testid="log-medicine-select"></select>
      <input data-testid="log-datetime-input" type="datetime-local"/>
      <input data-testid="log-notes-input" placeholder="Notes"/>
      <button data-testid="submit-log" type="submit">Log</button>
    </form>
  </div>
}
