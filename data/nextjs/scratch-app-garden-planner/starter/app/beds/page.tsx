'use client';
import React from 'react';
export function BedsPage() {
  return <div><h2>Beds</h2>
    <form data-testid="bed-add-form">
      <input data-testid="bed-name-input" placeholder="Bed name" />
      <input data-testid="bed-size-input" type="number" placeholder="Size sqft" />
      <button data-testid="bed-submit" type="submit">Add Bed</button>
    </form>
    <ul data-testid="bed-list"></ul>
  </div>;
}
