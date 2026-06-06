import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { GroceryCategory } from "../../lib/types";

export function AddItemPage() {
  const { handleAdd } = useApp();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("count");
  const [category, setCategory] = useState<GroceryCategory>("produce");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required."); return; }
    if (quantity <= 0) { setError("Quantity must be greater than 0."); return; }
    setError("");
    handleAdd({ name: name.trim(), quantity, unit, category });
  };

  return (
    <div>
      <h1>Add Grocery Item</h1>
      {error && <p data-testid="error-message">{error}</p>}
      <form data-testid="add-item-form" onSubmit={handleSubmit}>
        <input data-testid="input-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" />
        <input data-testid="input-quantity" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <input data-testid="input-unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Unit" />
        <select data-testid="select-category" value={category} onChange={(e) => setCategory(e.target.value as GroceryCategory)}>
          {(["produce","dairy","meat","bakery","frozen","pantry","beverages"] as GroceryCategory[]).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button type="submit" data-testid="submit-btn">Add Item</button>
      </form>
    </div>
  );
}
