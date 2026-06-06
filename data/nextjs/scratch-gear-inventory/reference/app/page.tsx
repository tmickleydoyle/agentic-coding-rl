import { useState } from "react";

type Category = "Shelter" | "Navigation" | "Lighting" | "Cooking" | "Hydration" | "Safety";
type Condition = "Excellent" | "Good" | "Fair" | "Poor";

interface GearItem {
  id: number;
  name: string;
  category: Category;
  quantity: number;
  condition: Condition;
  notes: string;
}

const SEED_GEAR: GearItem[] = [
  { id: 1, name: "Tent", category: "Shelter", quantity: 1, condition: "Good", notes: "3-season" },
  { id: 2, name: "Sleeping bag", category: "Shelter", quantity: 2, condition: "Excellent", notes: "Rated to 20°F" },
  { id: 3, name: "Trekking poles", category: "Navigation", quantity: 1, condition: "Fair", notes: "One tip worn" },
  { id: 4, name: "Headlamp", category: "Lighting", quantity: 2, condition: "Good", notes: "New batteries" },
  { id: 5, name: "Camp stove", category: "Cooking", quantity: 1, condition: "Good", notes: "Canister type" },
  { id: 6, name: "Water filter", category: "Hydration", quantity: 1, condition: "Excellent", notes: "" },
  { id: 7, name: "First aid kit", category: "Safety", quantity: 1, condition: "Good", notes: "Restocked 2024" },
  { id: 8, name: "Bear canister", category: "Safety", quantity: 1, condition: "Good", notes: "Required in some parks" },
];

const CATEGORIES: Category[] = ["Shelter", "Navigation", "Lighting", "Cooking", "Hydration", "Safety"];

const CONDITION_COLORS: Record<Condition, string> = {
  Excellent: "green",
  Good: "blue",
  Fair: "yellow",
  Poor: "red",
};

export default function App() {
  const [gear, setGear] = useState<GearItem[]>(SEED_GEAR);
  const [filter, setFilter] = useState<"All" | Category>("All");
  const [nextId, setNextId] = useState(9);

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<Category>("Shelter");
  const [formQuantity, setFormQuantity] = useState("1");
  const [formCondition, setFormCondition] = useState<Condition>("Good");
  const [formNotes, setFormNotes] = useState("");

  const filtered = filter === "All" ? gear : gear.filter((g) => g.category === filter);

  const addGear = () => {
    if (!formName.trim() || parseInt(formQuantity, 10) < 1) return;
    const qty = parseInt(formQuantity, 10);
    if (isNaN(qty) || qty < 1) return;
    setGear([
      ...gear,
      {
        id: nextId,
        name: formName.trim(),
        category: formCategory,
        quantity: qty,
        condition: formCondition,
        notes: formNotes,
      },
    ]);
    setNextId(nextId + 1);
    setFormName("");
    setFormQuantity("1");
    setFormNotes("");
  };

  const removeGear = (id: number) => {
    setGear(gear.filter((g) => g.id !== id));
  };

  const changeQty = (id: number, delta: number) => {
    setGear(
      gear.map((g) =>
        g.id === id ? { ...g, quantity: Math.max(1, g.quantity + delta) } : g
      )
    );
  };

  return (
    <div>
      <h1>Gear Inventory</h1>

      <div data-testid="filter-bar">
        <label htmlFor="category-filter">Filter by category:</label>
        <select
          id="category-filter"
          data-testid="category-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as "All" | Category)}
        >
          <option value="All">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div data-testid="item-count">{filtered.length} items</div>

      <div data-testid="gear-list">
        {filtered.map((item) => (
          <div key={item.id} data-testid={`gear-${item.id}`}>
            <span data-testid={`gear-name-${item.id}`}>{item.name}</span>
            <span data-testid={`gear-category-${item.id}`}>{item.category}</span>
            <span
              data-testid={`condition-badge-${item.id}`}
              data-condition={item.condition}
              style={{ color: CONDITION_COLORS[item.condition] }}
            >
              {item.condition}
            </span>
            <button data-testid={`decrement-${item.id}`} onClick={() => changeQty(item.id, -1)}>-</button>
            <span data-testid={`gear-qty-${item.id}`}>{item.quantity}</span>
            <button data-testid={`increment-${item.id}`} onClick={() => changeQty(item.id, 1)}>+</button>
            {item.notes && (
              <span data-testid={`gear-notes-${item.id}`}>{item.notes}</span>
            )}
            <button data-testid={`remove-${item.id}`} onClick={() => removeGear(item.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div data-testid="add-gear-form">
        <input
          data-testid="form-name"
          type="text"
          placeholder="Gear name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
        <select
          data-testid="form-category"
          value={formCategory}
          onChange={(e) => setFormCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          data-testid="form-quantity"
          type="number"
          value={formQuantity}
          onChange={(e) => setFormQuantity(e.target.value)}
        />
        <select
          data-testid="form-condition"
          value={formCondition}
          onChange={(e) => setFormCondition(e.target.value as Condition)}
        >
          {(["Excellent", "Good", "Fair", "Poor"] as Condition[]).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          data-testid="form-notes"
          type="text"
          placeholder="Notes (optional)"
          value={formNotes}
          onChange={(e) => setFormNotes(e.target.value)}
        />
        <button data-testid="add-gear-btn" onClick={addGear}>Add Gear</button>
      </div>
    </div>
  );
}
