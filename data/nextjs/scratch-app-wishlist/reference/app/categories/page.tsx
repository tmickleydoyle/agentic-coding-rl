"use client";
import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function CategoriesPage() {
  const { categories, setCategories, items } = useApp();
  const [name, setName] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const cat = { id: `c${Date.now()}`, name };
    setCategories((prev) => [...prev, cat]);
    setName("");
  }

  return (
    <div data-testid="categories-page">
      <h2>Categories</h2>
      <form data-testid="add-category-form" onSubmit={handleAdd}>
        <input data-testid="input-category-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" required />
        <button type="submit" data-testid="btn-add-category">Add Category</button>
      </form>
      <ul data-testid="category-list">
        {categories.map((c) => {
          const count = items.filter((i) => i.category === c.name).length;
          return (
            <li key={c.id} data-testid={`category-item-${c.id}`}>
              <span data-testid={`category-name-${c.id}`}>{c.name}</span>
              <span data-testid={`category-count-${c.id}`}>{count} items</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
