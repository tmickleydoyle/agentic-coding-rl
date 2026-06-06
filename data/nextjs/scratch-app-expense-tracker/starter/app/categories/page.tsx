'use client';
import React from 'react';

export function CategoriesPage() {
  return (
    <div>
      <h1>Categories</h1>
      <input data-testid="category-name" placeholder="Category name" />
      <input data-testid="category-color" type="color" />
      <button data-testid="add-category-btn">Add</button>
      <ul></ul>
    </div>
  );
}
