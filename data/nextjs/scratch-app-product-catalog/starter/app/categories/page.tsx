'use client'
import React from 'react'
export function CategoriesPage() {
  return (
    <div>
      <h1>Categories</h1>
      <form data-testid="add-category-form">
        <input data-testid="input-category-name" placeholder="Name" />
        <input data-testid="input-category-description" placeholder="Description" />
        <button data-testid="btn-add-category" type="submit">Add Category</button>
      </form>
      <ul data-testid="category-list"></ul>
    </div>
  )
}
