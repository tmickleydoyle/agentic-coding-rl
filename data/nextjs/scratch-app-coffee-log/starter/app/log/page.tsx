'use client';
import React from 'react';
export function LogPage() {
  return <div><h2>Brew Log</h2>
    <form data-testid="brew-add-form">
      <select data-testid="brew-bean-select"><option value="">Select bean</option></select>
      <select data-testid="brew-method-select"><option value="pour-over">pour-over</option></select>
      <input data-testid="brew-date-input" type="date" />
      <input data-testid="brew-rating-input" type="number" placeholder="Rating" />
      <input data-testid="brew-notes-input" placeholder="Notes" />
      <button data-testid="brew-submit" type="submit">Add Brew</button>
    </form>
    <ul data-testid="brew-list"></ul>
  </div>;
}
