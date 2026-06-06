import React, { useState } from "react";

interface ValuationEntry {
  id: number;
  itemName: string;
  category: string;
  valuedBy: string;
  date: string;
  estimatedValue: number;
  notes: string;
}

const CATEGORIES = ["Furniture", "Glassware", "Jewelry", "Ceramics", "Clocks", "Art", "Other"];

const SEED_ENTRIES: ValuationEntry[] = [
  { id: 1, itemName: "Tiffany Floor Lamp", category: "Glassware", valuedBy: "Jane Smith", date: "2023-03-15", estimatedValue: 12000, notes: "Excellent original shade" },
  { id: 2, itemName: "Victorian Writing Desk", category: "Furniture", valuedBy: "Bob Chen", date: "2023-06-01", estimatedValue: 3400, notes: "Minor veneer damage" },
  { id: 3, itemName: "Art Deco Brooch", category: "Jewelry", valuedBy: "Jane Smith", date: "2024-01-20", estimatedValue: 850, notes: "Platinum and diamonds" },
  { id: 4, itemName: "Meissen Figurine", category: "Ceramics", valuedBy: "Alice Park", date: "2023-11-05", estimatedValue: 2100, notes: "Crossed swords mark" },
  { id: 5, itemName: "Edwardian Carriage Clock", category: "Clocks", valuedBy: "Bob Chen", date: "2024-02-28", estimatedValue: 1750, notes: "Fully working movement" },
];

function formatValue(v: number): string {
  return "$" + Math.round(v).toLocaleString("en-US");
}

export default function App() {
  const [entries, setEntries] = useState<ValuationEntry[]>(SEED_ENTRIES);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [valuedBy, setValuedBy] = useState("");
  const [date, setDate] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [filterCategory, setFilterCategory] = useState("All");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = () => {
    if (!itemName.trim()) { setFormError("Item name is required"); return; }
    if (!valuedBy.trim()) { setFormError("Valued by is required"); return; }
    if (!date) { setFormError("Date is required"); return; }
    const evNum = Number(estimatedValue);
    if (!estimatedValue || evNum <= 0) { setFormError("Estimated value must be greater than 0"); return; }
    setFormError("");
    const newId = entries.length > 0 ? Math.max(...entries.map((e) => e.id)) + 1 : 1;
    setEntries([...entries, { id: newId, itemName: itemName.trim(), category, valuedBy: valuedBy.trim(), date, estimatedValue: evNum, notes: notes.trim() }]);
    setItemName(""); setCategory(CATEGORIES[0]); setValuedBy(""); setDate(""); setEstimatedValue(""); setNotes("");
  };

  const handleDelete = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const handleEditStart = (entry: ValuationEntry) => {
    setEditingId(entry.id);
    setEditValue(String(entry.estimatedValue));
  };

  const handleSave = (id: number) => {
    const newVal = Number(editValue);
    if (newVal > 0) {
      setEntries(entries.map((e) => e.id === id ? { ...e, estimatedValue: newVal } : e));
    }
    setEditingId(null);
  };

  const filteredEntries = entries.filter((e) => {
    if (filterCategory !== "All" && e.category !== filterCategory) return false;
    return true;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === "date-asc") return a.date.localeCompare(b.date);
    if (sortBy === "date-desc") return b.date.localeCompare(a.date);
    if (sortBy === "value-asc") return a.estimatedValue - b.estimatedValue;
    if (sortBy === "value-desc") return b.estimatedValue - a.estimatedValue;
    return 0;
  });

  const totalEntries = entries.length;
  const avgValue = totalEntries > 0 ? entries.reduce((sum, e) => sum + e.estimatedValue, 0) / totalEntries : 0;
  const topItem = entries.length > 0 ? entries.reduce((max, e) => e.estimatedValue > max.estimatedValue ? e : max, entries[0]).itemName : "";

  return (
    <div>
      <h1 data-testid="heading">Valuation Log</h1>

      <div data-testid="add-form">
        <input data-testid="input-item-name" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Item name" />
        <select data-testid="select-category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input data-testid="input-valued-by" value={valuedBy} onChange={(e) => setValuedBy(e.target.value)} placeholder="Valued by" />
        <input data-testid="input-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="input-estimated-value" type="number" value={estimatedValue} onChange={(e) => setEstimatedValue(e.target.value)} placeholder="Estimated value" />
        <textarea data-testid="input-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
        <button data-testid="btn-add" onClick={handleAdd}>Add Entry</button>
        {formError && <span data-testid="form-error">{formError}</span>}
      </div>

      <div>
        <select data-testid="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date-asc">date-asc</option>
          <option value="date-desc">date-desc</option>
          <option value="value-asc">value-asc</option>
          <option value="value-desc">value-desc</option>
        </select>
        <select data-testid="filter-category" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="All">All</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div data-testid="entry-list">
        {sortedEntries.map((entry) => (
          <div key={entry.id} data-testid={`entry-${entry.id}`}>
            <span data-testid={`entry-name-${entry.id}`}>{entry.itemName}</span>
            <span>{entry.category}</span>
            <span>{entry.valuedBy}</span>
            <span>{entry.date}</span>
            <span data-testid={`entry-value-${entry.id}`}>{formatValue(entry.estimatedValue)}</span>
            {entry.notes && <span data-testid={`entry-notes-${entry.id}`}>{entry.notes}</span>}
            {editingId === entry.id ? (
              <>
                <input
                  data-testid={`edit-input-${entry.id}`}
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <button data-testid={`btn-save-${entry.id}`} onClick={() => handleSave(entry.id)}>Save</button>
              </>
            ) : (
              <button data-testid={`btn-edit-${entry.id}`} onClick={() => handleEditStart(entry)}>Edit Value</button>
            )}
            <button data-testid={`btn-delete-${entry.id}`} onClick={() => handleDelete(entry.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div data-testid="summary">
        <span>Total entries: {totalEntries}</span>
        <span data-testid="avg-value">{formatValue(avgValue)}</span>
        <span data-testid="top-item">{topItem}</span>
      </div>
    </div>
  );
}
