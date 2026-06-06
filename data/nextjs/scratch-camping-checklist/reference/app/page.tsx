import { useState } from "react";

type Category = "Shelter" | "Food & Water" | "Clothing";

interface ChecklistItem {
  id: number;
  name: string;
  category: Category;
  packed: boolean;
}

const SEED_ITEMS: ChecklistItem[] = [
  { id: 1, name: "Tent", category: "Shelter", packed: false },
  { id: 2, name: "Sleeping bag", category: "Shelter", packed: true },
  { id: 3, name: "Sleeping pad", category: "Shelter", packed: false },
  { id: 4, name: "Water filter", category: "Food & Water", packed: false },
  { id: 5, name: "Camp stove", category: "Food & Water", packed: true },
  { id: 6, name: "Food supplies", category: "Food & Water", packed: false },
  { id: 7, name: "Rain jacket", category: "Clothing", packed: true },
  { id: 8, name: "Hiking boots", category: "Clothing", packed: true },
  { id: 9, name: "Warm layers", category: "Clothing", packed: false },
];

const CATEGORIES: Category[] = ["Shelter", "Food & Water", "Clothing"];

export default function App() {
  const [items, setItems] = useState<ChecklistItem[]>(SEED_ITEMS);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("Shelter");
  const [nextId, setNextId] = useState(10);

  const totalPacked = items.filter((i) => i.packed).length;
  const total = items.length;

  const togglePacked = (id: number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, packed: !i.packed } : i)));
  };

  const removeItem = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const addItem = () => {
    if (!newName.trim()) return;
    setItems([...items, { id: nextId, name: newName.trim(), category: newCategory, packed: false }]);
    setNextId(nextId + 1);
    setNewName("");
  };

  const clearPacked = () => {
    setItems(items.filter((i) => !i.packed));
  };

  const presentCategories = CATEGORIES.filter((cat) => items.some((i) => i.category === cat));

  return (
    <div>
      <h1>Camping Checklist</h1>

      <div data-testid="summary">
        {totalPacked} of {total} items packed
      </div>

      <button data-testid="clear-packed" onClick={clearPacked}>
        Clear Packed
      </button>

      <div data-testid="add-item-form">
        <input
          data-testid="new-item-name"
          type="text"
          placeholder="Item name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <select
          data-testid="new-item-category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button data-testid="add-item-btn" onClick={addItem}>
          Add Item
        </button>
      </div>

      <div data-testid="checklist">
        {presentCategories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          const catPacked = catItems.filter((i) => i.packed).length;
          return (
            <div key={cat} data-testid={`category-${cat.replace(/ & /g, "-")}`}>
              <h2 data-testid={`category-heading-${cat.replace(/ & /g, "-")}`}>
                {cat} ({catPacked}/{catItems.length})
              </h2>
              <ul>
                {catItems.map((item) => (
                  <li key={item.id} data-testid={`item-${item.id}`}>
                    <input
                      type="checkbox"
                      data-testid={`checkbox-${item.id}`}
                      checked={item.packed}
                      onChange={() => togglePacked(item.id)}
                    />
                    <span
                      data-testid={`item-name-${item.id}`}
                      style={{ textDecoration: item.packed ? "line-through" : "none" }}
                    >
                      {item.name}
                    </span>
                    <button data-testid={`remove-${item.id}`} onClick={() => removeItem(item.id)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
