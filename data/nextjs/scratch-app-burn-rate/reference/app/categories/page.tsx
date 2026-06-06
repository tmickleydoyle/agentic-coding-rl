import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Category } from "../../lib/types";

export default function CategoriesPage() {
  const { categories, transactions, setCategories } = useApp();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!name.trim()) { setError("Name required"); return; }
    setError("");
    const cat: Category = { id: String(Date.now()), name: name.trim() };
    setCategories([...categories, cat]);
    setName("");
  }

  function handleDelete(id: string) {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    const inUse = transactions.some((t) => t.category === cat.name);
    if (inUse) { setError(`Cannot delete "${cat.name}" — it has transactions`); return; }
    setError("");
    setCategories(categories.filter((c) => c.id !== id));
  }

  return (
    <div data-testid="categories-page">
      <h1>Categories</h1>
      {error && <div data-testid="category-error">{error}</div>}
      <div data-testid="add-category-form">
        <input data-testid="category-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
        <button data-testid="add-category-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul data-testid="category-list">
        {categories.map((c) => (
          <li key={c.id} data-testid={`category-item-${c.id}`}>
            <span data-testid={`category-name-${c.id}`}>{c.name}</span>
            <button data-testid={`delete-category-${c.id}`} onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
