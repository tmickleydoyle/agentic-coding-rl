'use client';
import React from 'react';
export function BeansPage() {
  return <div><h2>Beans</h2>
    <form data-testid="bean-add-form">
      <input data-testid="bean-name-input" placeholder="Bean name" />
      <input data-testid="bean-origin-input" placeholder="Origin" />
      <select data-testid="bean-roast-select"><option value="medium">medium</option></select>
      <input data-testid="bean-price-input" type="number" placeholder="Price" />
      <button data-testid="bean-submit" type="submit">Add Bean</button>
    </form>
    <ul data-testid="bean-list"></ul>
  </div>;
}
