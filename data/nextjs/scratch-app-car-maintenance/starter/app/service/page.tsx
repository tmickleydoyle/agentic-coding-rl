'use client';
import React from 'react';
export function ServicePage() {
  return <div><h2>Service Records</h2>
    <form data-testid="service-add-form">
      <select data-testid="service-vehicle-select"><option value="">Select vehicle</option></select>
      <input data-testid="service-type-input" placeholder="Service type" />
      <input data-testid="service-date-input" type="date" />
      <input data-testid="service-mileage-input" type="number" placeholder="Mileage" />
      <input data-testid="service-cost-input" type="number" placeholder="Cost" />
      <input data-testid="service-notes-input" placeholder="Notes" />
      <button data-testid="service-submit" type="submit">Add Record</button>
    </form>
    <ul data-testid="service-list"></ul>
  </div>;
}
