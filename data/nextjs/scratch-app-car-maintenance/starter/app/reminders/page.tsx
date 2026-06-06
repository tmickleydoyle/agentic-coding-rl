'use client';
import React from 'react';
export function RemindersPage() {
  return <div><h2>Reminders</h2>
    <form data-testid="reminder-add-form">
      <select data-testid="reminder-vehicle-select"><option value="">Select vehicle</option></select>
      <input data-testid="reminder-title-input" placeholder="Title" />
      <input data-testid="reminder-due-date-input" type="date" />
      <input data-testid="reminder-due-mileage-input" type="number" placeholder="Due mileage" />
      <button data-testid="reminder-submit" type="submit">Add Reminder</button>
    </form>
    <ul data-testid="reminder-list"></ul>
  </div>;
}
