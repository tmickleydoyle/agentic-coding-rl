import React, { useState } from "react";

interface Piercing {
  id: number;
  location: string;
  date: string;
  healed: boolean;
  notes: string;
}

const SEED_PIERCINGS: Piercing[] = [
  { id: 1, location: "Left earlobe", date: "2023-03-15", healed: true, notes: "No issues" },
  { id: 2, location: "Nostril", date: "2023-08-22", healed: false, notes: "Still tender" },
  { id: 3, location: "Eyebrow", date: "2022-11-01", healed: true, notes: "Took 6 months" },
  { id: 4, location: "Navel", date: "2024-01-10", healed: false, notes: "Keep dry" },
];

export default function App() {
  const [piercings, setPiercings] = useState<Piercing[]>(SEED_PIERCINGS);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Healing">("All");
  const [nextId, setNextId] = useState(5);

  const handleAdd = () => {
    if (!location.trim() || !date.trim()) return;
    const newPiercing: Piercing = {
      id: nextId,
      location: location.trim(),
      date: date.trim(),
      healed: false,
      notes: notes.trim(),
    };
    setPiercings([...piercings, newPiercing]);
    setNextId(nextId + 1);
    setLocation("");
    setDate("");
    setNotes("");
  };

  const toggleHealed = (id: number) => {
    setPiercings(piercings.map((p) => (p.id === id ? { ...p, healed: !p.healed } : p)));
  };

  const deletePiercing = (id: number) => {
    setPiercings(piercings.filter((p) => p.id !== id));
  };

  const visible =
    activeTab === "Healing" ? piercings.filter((p) => !p.healed) : piercings;

  const healedCount = piercings.filter((p) => p.healed).length;

  return (
    <div>
      <h1>Piercing Log</h1>

      <div data-testid="add-form">
        <input
          data-testid="location-input"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          data-testid="date-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          data-testid="notes-input"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button data-testid="add-button" onClick={handleAdd}>
          Add Piercing
        </button>
      </div>

      <div data-testid="tabs">
        <button
          data-testid={activeTab === "All" ? "active-tab" : "tab-all"}
          onClick={() => setActiveTab("All")}
        >
          All
        </button>
        <button
          data-testid={activeTab === "Healing" ? "active-tab" : "tab-healing"}
          onClick={() => setActiveTab("Healing")}
        >
          Healing
        </button>
      </div>

      <div data-testid="piercing-summary">
        {healedCount} healed / {piercings.length} total
      </div>

      <div data-testid="piercings-list">
        {visible.map((p) => (
          <div key={p.id} data-testid="piercing-card">
            <span data-testid="piercing-location">{p.location}</span>
            <span data-testid="piercing-date">{p.date}</span>
            {p.notes && <span data-testid="piercing-notes">{p.notes}</span>}
            {p.healed && <span data-testid="healed-badge">Healed</span>}
            <button
              data-testid="toggle-healed-button"
              onClick={() => toggleHealed(p.id)}
            >
              {p.healed ? "Mark Healing" : "Mark Healed"}
            </button>
            <button
              data-testid="delete-button"
              onClick={() => deletePiercing(p.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
