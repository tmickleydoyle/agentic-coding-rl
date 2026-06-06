import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { PantryCategory } from "../../lib/types";

export function AddItemPage() {
  const { handleAdd } = useApp();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("count");
  const [category, setCategory] = useState<PantryCategory>("grain");
  const [threshold, setThreshold] = useState(2);
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required."); return; }
    setError("");
    handleAdd({ name: name.trim(), quantity, unit, category, threshold, expiresAt: expiresAt || new Date().toISOString() });
  };

  return (
    <div>
      <h1>Add Pantry Item</h1>
      {error && <p data-testid="error-message">{error}</p>}
      <form data-testid="add-item-form" onSubmit={handleSubmit}>
        <input data-testid="input-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" />
        <input data-testid="input-quantity" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <input data-testid="input-unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
        <select data-testid="select-category" value={category} onChange={(e) => setCategory(e.target.value as PantryCategory)}>
          {(["grain","canned","spice","oil","snack","condiment","other"] as PantryCategory[]).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input data-testid="input-threshold" type="number" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />
        <input data-testid="input-expires" type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
        <button type="submit" data-testid="submit-btn">Add Item</button>
      </form>
    </div>
  );
}
