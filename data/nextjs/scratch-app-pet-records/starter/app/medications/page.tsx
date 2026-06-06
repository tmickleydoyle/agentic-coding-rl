'use client';
import React from 'react';
export function MedicationsPage() {
  return <div><h2>Medications</h2>
    <form data-testid="med-add-form">
      <select data-testid="med-pet-select"><option value="">Select pet</option></select>
      <input data-testid="med-name-input" placeholder="Medication name" />
      <input data-testid="med-dosage-input" placeholder="Dosage" />
      <select data-testid="med-freq-select"><option value="daily">daily</option></select>
      <button data-testid="med-submit" type="submit">Add</button>
    </form>
    <ul data-testid="med-list"></ul>
  </div>;
}
