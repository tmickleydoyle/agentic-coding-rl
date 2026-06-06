'use client';
import React from 'react';
export function VisitsPage() {
  return <div><h2>Vet Visits</h2>
    <form data-testid="visit-add-form">
      <select data-testid="visit-pet-select"><option value="">Select pet</option></select>
      <input data-testid="visit-vet-input" placeholder="Vet name" />
      <input data-testid="visit-date-input" type="date" />
      <input data-testid="visit-reason-input" placeholder="Reason" />
      <input data-testid="visit-notes-input" placeholder="Notes" />
      <button data-testid="visit-submit" type="submit">Add Visit</button>
    </form>
    <ul data-testid="visit-list"></ul>
  </div>;
}
