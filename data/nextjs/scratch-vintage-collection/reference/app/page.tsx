import React, { useState } from "react";

interface VintageItem {
  id: number;
  name: string;
  category: string;
  year: number;
  price: number;
  sold: boolean;
}

const SEED_ITEMS: VintageItem[] = [
  { id: 1, name: "Art Deco Lamp", category: "Furniture", year: 1925, price: 450, sold: false },
  { id: 2, name: "Bakelite Radio", category: "Electronics", year: 1938, price: 320, sold: false },
  { id: 3, name: "Victorian Brooch", category: "Jewelry", year: 1890, price: 180, sold: true },
  { id: 4, name: "Tin Toy Train", category: "Toys", year: 1952, price: 95, sold: false },
  { id: 5, name: "Tiffany Vase", category: "Glassware", year: 1910, price: 780, sold: false },
];

const CATEGORIES = ["Furniture", "Electronics", "Jewelry", "Toys", "Glassware", "Other"];

export default function App() {
  const [items, setItems] = useState<VintageItem[]>(SEED_ITEMS);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [formError, setFormError] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [hideSold, setHideSold] = useState(false);

  const handleAdd = () => {
    if (!name.trim()) {
      setFormError("Name is required");
      return;
    }
    const yearNum = Number(year);
    if (!year || yearNum < 1000 || yearNum > 2999) {
      setFormError("Year must be between 1000 and 2999");
      return;
    }
    const priceNum = Number(price);
    if (!price || priceNum <= 0) {
      setFormError("Price must be greater than 0");
      return;
    }
    setFormError("");
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems([...items, { id: newId, name: name.trim(), category, year: yearNum, price: priceNum, sold: false }]);
    setName("");
    setCategory(CATEGORIES[0]);
    setYear("");
    setPrice("");
  };

  const handleMarkSold = (id: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, sold: true } : item)));
  };

  const handleRemove = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) => {
    if (filterCategory !== "All" && item.category !== filterCategory) return false;
    if (hideSold && item.sold) return false;
    return true;
  });

  const totalUnsoldValue = items.filter((i) => !i.sold).reduce((sum, i) => sum + i.price, 0);

  return (
    <div>
      <h1 data-testid="heading">Vintage Collection</h1>

      <div data-testid="add-form">
        <input
          data-testid="input-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
        />
        <select
          data-testid="select-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          data-testid="input-year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
        />
        <input
          data-testid="input-price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
        />
        <button data-testid="btn-add" onClick={handleAdd}>Add Item</button>
        {formError && <span data-testid="form-error">{formError}</span>}
      </div>

      <div>
        <select
          data-testid="filter-category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <label>
          <input
            data-testid="filter-hide-sold"
            type="checkbox"
            checked={hideSold}
            onChange={(e) => setHideSold(e.target.checked)}
          />
          Hide Sold
        </label>
      </div>

      <div data-testid="item-list">
        {filteredItems.map((item) => (
          <div key={item.id} data-testid={`item-${item.id}`}>
            <span data-testid={`item-name-${item.id}`}>{item.name}</span>
            <span>{item.category}</span>
            <span>{item.year}</span>
            <span>${item.price}</span>
            {item.sold && <span data-testid={`item-sold-${item.id}`}>SOLD</span>}
            {!item.sold && (
              <button data-testid={`btn-sold-${item.id}`} onClick={() => handleMarkSold(item.id)}>
                Mark Sold
              </button>
            )}
            <button data-testid={`btn-remove-${item.id}`} onClick={() => handleRemove(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div data-testid="summary">
        <span>Total items: {items.length}</span>
        <span>Total unsold value: ${totalUnsoldValue}</span>
      </div>
    </div>
  );
}
