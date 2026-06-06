import React, { useState } from "react";

interface Supply {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
}

const CATEGORIES = ["Paint", "Tools", "Surface", "Adhesive", "Fabric", "Other"];

const SEED: Supply[] = [
  { id: 1, name: "Red Acrylic Paint", category: "Paint", quantity: 3, unit: "bottles" },
  { id: 2, name: "Watercolor Set", category: "Paint", quantity: 1, unit: "set" },
  { id: 3, name: "Scissors", category: "Tools", quantity: 2, unit: "pairs" },
  { id: 4, name: "Canvas 8x10", category: "Surface", quantity: 10, unit: "sheets" },
  { id: 5, name: "Hot Glue Sticks", category: "Adhesive", quantity: 50, unit: "sticks" },
];

export default function App() {
  const [supplies, setSupplies] = useState<Supply[]>(SEED);
  const [nextId, setNextId] = useState(6);
  const [filterCategory, setFilterCategory] = useState("All");

  const [inputName, setInputName] = useState("");
  const [inputCategory, setInputCategory] = useState("Paint");
  const [inputQuantity, setInputQuantity] = useState("");
  const [inputUnit, setInputUnit] = useState("");

  const handleAdd = () => {
    if (!inputName.trim()) return;
    const qty = parseInt(inputQuantity, 10);
    if (!qty || qty <= 0) return;
    const newSupply: Supply = {
      id: nextId,
      name: inputName.trim(),
      category: inputCategory,
      quantity: qty,
      unit: inputUnit.trim(),
    };
    setSupplies((prev) => [...prev, newSupply]);
    setNextId((n) => n + 1);
    setInputName("");
    setInputCategory("Paint");
    setInputQuantity("");
    setInputUnit("");
  };

  const handleIncrement = (id: number) => {
    setSupplies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, quantity: s.quantity + 1 } : s))
    );
  };

  const handleDecrement = (id: number) => {
    setSupplies((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, quantity: Math.max(0, s.quantity - 1) } : s
      )
    );
  };

  const handleDelete = (id: number) => {
    setSupplies((prev) => prev.filter((s) => s.id !== id));
  };

  const displayed = filterCategory === "All"
    ? supplies
    : supplies.filter((s) => s.category === filterCategory);

  return (
    <div>
      <h1>Craft Supplies Inventory</h1>

      <div>
        <label htmlFor="input-name">Supply Name</label>
        <input
          id="input-name"
          data-testid="input-name"
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
        />
        <label htmlFor="select-category">Category</label>
        <select
          id="select-category"
          data-testid="select-category"
          value={inputCategory}
          onChange={(e) => setInputCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <label htmlFor="input-quantity">Quantity</label>
        <input
          id="input-quantity"
          data-testid="input-quantity"
          type="number"
          value={inputQuantity}
          onChange={(e) => setInputQuantity(e.target.value)}
        />
        <label htmlFor="input-unit">Unit</label>
        <input
          id="input-unit"
          data-testid="input-unit"
          type="text"
          value={inputUnit}
          onChange={(e) => setInputUnit(e.target.value)}
        />
        <button data-testid="btn-add" onClick={handleAdd}>
          Add Supply
        </button>
      </div>

      <div>
        <label htmlFor="filter-category">Filter by Category</label>
        <select
          id="filter-category"
          data-testid="filter-category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div data-testid="total-count">Total: {supplies.length} items</div>

      {displayed.length === 0 ? (
        <div data-testid="empty-msg">No supplies found</div>
      ) : (
        <div>
          {displayed.map((s) => (
            <div key={s.id} data-testid={`supply-${s.id}`}>
              <span data-testid={`supply-name-${s.id}`}>{s.name}</span>
              <span data-testid={`supply-category-${s.id}`}>{s.category}</span>
              <span data-testid={`supply-quantity-${s.id}`}>{s.quantity}</span>
              <span data-testid={`supply-unit-${s.id}`}>{s.unit}</span>
              <button
                data-testid={`btn-increment-${s.id}`}
                onClick={() => handleIncrement(s.id)}
              >
                +
              </button>
              <button
                data-testid={`btn-decrement-${s.id}`}
                onClick={() => handleDecrement(s.id)}
              >
                -
              </button>
              <button
                data-testid={`btn-delete-${s.id}`}
                onClick={() => handleDelete(s.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
