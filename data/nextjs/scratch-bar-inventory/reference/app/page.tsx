import { useState } from "react";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  threshold: number;
}

const SEED_ITEMS: InventoryItem[] = [
  { id: 1, name: "Hendrick's Gin", category: "Gin", quantity: 3, unit: "bottles", threshold: 2 },
  { id: 2, name: "Grey Goose Vodka", category: "Vodka", quantity: 1, unit: "bottles", threshold: 2 },
  { id: 3, name: "Bulleit Bourbon", category: "Whiskey", quantity: 5, unit: "bottles", threshold: 2 },
  { id: 4, name: "Patron Silver", category: "Tequila", quantity: 2, unit: "bottles", threshold: 2 },
  { id: 5, name: "Bacardi White Rum", category: "Rum", quantity: 0, unit: "bottles", threshold: 2 },
  { id: 6, name: "Campari", category: "Liqueur", quantity: 4, unit: "bottles", threshold: 2 },
];

export default function App() {
  const [items, setItems] = useState<InventoryItem[]>(SEED_ITEMS);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [threshold, setThreshold] = useState("2");

  const categories: string[] = [];
  items.forEach((item) => {
    if (!categories.includes(item.category)) categories.push(item.category);
  });

  const lowStockCount = items.filter((i) => i.quantity <= i.threshold).length;

  const handleIncrement = (id: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const handleDecrement = (id: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i
      )
    );
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    const newItem: InventoryItem = {
      id: Date.now(),
      name: name.trim(),
      category: category.trim() || "Other",
      quantity: parseInt(quantity) || 0,
      unit: "bottles",
      threshold: parseInt(threshold) || 2,
    };
    setItems((prev) => [...prev, newItem]);
    setName("");
    setCategory("");
    setQuantity("");
    setThreshold("2");
  };

  const visible =
    categoryFilter === "All"
      ? items
      : items.filter((i) => i.category === categoryFilter);

  return (
    <div>
      <h1>Bar Inventory</h1>

      {lowStockCount > 0 && (
        <div data-testid="low-stock-banner">
          Low Stock Alert: {lowStockCount} item(s) need restocking
        </div>
      )}

      <div>
        <button
          data-testid="filter-all"
          aria-pressed={categoryFilter === "All"}
          onClick={() => setCategoryFilter("All")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            data-testid="category-filter"
            aria-pressed={categoryFilter === cat}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div data-testid="inventory-list">
        {visible.map((item) => (
          <div key={item.id} data-testid="inventory-card">
            <span data-testid="item-name">{item.name}</span>
            <span data-testid="item-category">{item.category}</span>
            <span data-testid="item-quantity">{item.quantity}</span>
            {item.quantity <= item.threshold && (
              <span data-testid="low-stock-indicator">Low Stock</span>
            )}
            <button data-testid="increment-qty" onClick={() => handleIncrement(item.id)}>
              +
            </button>
            <button data-testid="decrement-qty" onClick={() => handleDecrement(item.id)}>
              −
            </button>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <label>
          Name
          <input
            data-testid="input-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Category
          <input
            data-testid="input-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>
        <label>
          Quantity
          <input
            data-testid="input-quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
        <label>
          Threshold
          <input
            data-testid="input-threshold"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
          />
        </label>
        <button type="submit" data-testid="submit-item">
          Add Item
        </button>
      </form>
    </div>
  );
}
