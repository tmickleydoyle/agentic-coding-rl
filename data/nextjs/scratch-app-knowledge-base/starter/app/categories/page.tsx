'use client'
import React from 'react'
export function CategoriesPage() { return <div><h1>Categories</h1><ul data-testid="category-list"></ul><form data-testid="add-category-form"><input data-testid="category-name-input" placeholder="Name"/><input data-testid="category-description-input" placeholder="Description"/><button data-testid="submit-category" type="submit">Add</button></form></div> }
