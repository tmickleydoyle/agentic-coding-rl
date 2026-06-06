import React, { useState } from "react";
import { getItems, addItem, adjustQuantity } from "../../lib/store";
import type { FoodCategory } from "../../lib/types";

export function InventoryPage() {
  const [, setTick] = useState(0);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FoodCategory>("Canned");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [expiry, setExpiry] = useState("");

  const items = getItems();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addItem(name.trim(), category, parseInt(quantity, 10) || 0, unit.trim(), expiry);
    setName(""); setQuantity(""); setUnit(""); setExpiry("");
    setTick((t) => t + 1);
  }

  return (
    <div data-testid="inventory-page">
      <h2>Inventory</h2>
      <form data-testid="item-form" onSubmit={handleSubmit}>
        <input data-testid="item-name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <select data-testid="item-category" value={category} onChange={(e) => setCategory(e.target.value as FoodCategory)}>
          <option value="Produce">Produce</option>
          <option value="Canned">Canned</option>
          <option value="Dry">Dry</option>
          <option value="Dairy">Dairy</option>
        </select>
        <input data-testid="item-quantity" type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <input data-testid="item-unit" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
        <input data-testid="item-expiry" type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        <button data-testid="item-submit" type="submit">Add Item</button>
      </form>
      {items.map((item) => (
        <div key={item.id} data-testid={`item-row-${item.id}`}>
          <span data-testid={`item-name-${item.id}`}>{item.name}</span>
          <span data-testid={`item-quantity-${item.id}`}>{item.quantity}</span>
          <span data-testid={`item-category-${item.id}`}>{item.category}</span>
          <button data-testid={`item-dec-${item.id}`} onClick={() => { adjustQuantity(item.id, -1); setTick((t) => t + 1); }}>-</button>
          <button data-testid={`item-inc-${item.id}`} onClick={() => { adjustQuantity(item.id, 1); setTick((t) => t + 1); }}>+</button>
        </div>
      ))}
    </div>
  );
}
