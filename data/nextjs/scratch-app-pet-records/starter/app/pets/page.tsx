'use client';
import React from 'react';
export function PetsPage() {
  return <div><h2>Pets</h2>
    <form data-testid="pet-add-form">
      <input data-testid="pet-name-input" placeholder="Pet name" />
      <select data-testid="pet-species-select"><option value="dog">dog</option></select>
      <input data-testid="pet-birth-input" type="date" />
      <input data-testid="pet-weight-input" type="number" placeholder="Weight kg" />
      <button data-testid="pet-submit" type="submit">Add Pet</button>
    </form>
    <ul data-testid="pet-list"></ul>
  </div>;
}
