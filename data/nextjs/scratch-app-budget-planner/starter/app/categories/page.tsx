'use client'
import React from 'react';
export function CategoriesPage() {
  return (
    <main data-testid="categories-page">
      <h2>Categories</h2>
      <div data-testid="add-category-form">
        <input data-testid="cat-name-input" placeholder="Name" />
        <select data-testid="cat-type-select"><option value="expense">Expense</option><option value="income">Income</option></select>
        <input data-testid="cat-limit-input" type="number" placeholder="Budget limit" />
        <button data-testid="add-cat-btn">Add Category</button>
      </div>
      <ul data-testid="categories-list" />
    </main>
  );
}
