'use client'
import React from 'react';
export function LogPage() {
  return (
    <main data-testid="log-page">
      <h2>Weather Log</h2>
      <div data-testid="add-entry-form">
        <input data-testid="entry-date-input" type="date" />
        <input data-testid="entry-temp-input" type="number" placeholder="Temperature" />
        <select data-testid="entry-condition-select">
          <option value="sunny">sunny</option><option value="cloudy">cloudy</option>
          <option value="rainy">rainy</option><option value="snowy">snowy</option><option value="windy">windy</option>
        </select>
        <input data-testid="entry-humidity-input" type="number" placeholder="Humidity %" />
        <input data-testid="entry-notes-input" placeholder="Notes" />
        <button data-testid="add-entry-btn">Add Entry</button>
      </div>
      <ul data-testid="entries-list" />
    </main>
  );
}
