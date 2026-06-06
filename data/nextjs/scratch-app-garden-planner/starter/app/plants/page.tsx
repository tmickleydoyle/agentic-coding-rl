'use client';
import React from 'react';
export function PlantsPage() {
  return <div><h2>Plants</h2>
    <form data-testid="plant-add-form">
      <input data-testid="plant-name-input" placeholder="Plant name" />
      <select data-testid="plant-type-select"><option value="vegetable">vegetable</option></select>
      <select data-testid="plant-sun-select"><option value="full">full</option></select>
      <select data-testid="plant-water-select"><option value="weekly">weekly</option></select>
      <button data-testid="plant-submit" type="submit">Add Plant</button>
    </form>
    <ul data-testid="plant-list"></ul>
  </div>;
}
