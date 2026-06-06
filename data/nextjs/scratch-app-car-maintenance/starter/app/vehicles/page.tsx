'use client';
import React from 'react';
export function VehiclesPage() {
  return <div><h2>Vehicles</h2>
    <form data-testid="vehicle-add-form">
      <input data-testid="vehicle-make-input" placeholder="Make" />
      <input data-testid="vehicle-model-input" placeholder="Model" />
      <input data-testid="vehicle-year-input" type="number" placeholder="Year" />
      <input data-testid="vehicle-mileage-input" type="number" placeholder="Mileage" />
      <button data-testid="vehicle-submit" type="submit">Add Vehicle</button>
    </form>
    <ul data-testid="vehicle-list"></ul>
  </div>;
}
