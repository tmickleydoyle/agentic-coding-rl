"use client";
import React from "react";

export function CalendarPage() {
  return (
    <div data-testid="calendar-page">
      <h2>Training Log</h2>
      <select data-testid="log-exercise-select"><option value="">Select exercise</option></select>
      <input data-testid="log-date-input" type="date" />
      <input data-testid="log-sets-input" type="number" placeholder="Sets" />
      <input data-testid="log-reps-input" type="number" placeholder="Reps" />
      <input data-testid="log-weight-input" type="number" placeholder="Weight (kg)" />
      <button data-testid="add-log-btn">Add Entry</button>
      <ul data-testid="log-list"></ul>
    </div>
  );
}
