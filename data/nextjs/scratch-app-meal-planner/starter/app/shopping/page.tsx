'use client'
import React from 'react';
export function ShoppingPage() {
  return (
    <main data-testid="shopping-page">
      <h2>Shopping List</h2>
      <p data-testid="no-ingredients-msg">No ingredients — plan some meals first</p>
      <ul data-testid="auto-ingredients-list" />
      <div data-testid="add-custom-form">
        <input data-testid="custom-item-input" placeholder="Add custom item" />
        <button data-testid="add-custom-btn">Add</button>
      </div>
      <ul data-testid="custom-items-list" />
    </main>
  );
}
