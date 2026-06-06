import React, { useState } from "react";

type LoreType = "Artifact" | "Location" | "Character" | "Event";

interface LoreEntry {
  id: number;
  name: string;
  type: LoreType;
  description: string;
  favorite: boolean;
}

const SEED_ENTRIES: LoreEntry[] = [
  { id: 1, name: "The Sunstone", type: "Artifact", description: "A gemstone that glows with the power of the sun", favorite: true },
  { id: 2, name: "Elyndria", type: "Location", description: "A mystical forest realm inhabited by ancient elves", favorite: false },
  { id: 3, name: "Voryn the Betrayer", type: "Character", description: "A fallen paladin who turned to dark magic", favorite: true },
  { id: 4, name: "The Sundering", type: "Event", description: "The cataclysm that split the world into four continents", favorite: false },
];

const LORE_TYPES: LoreType[] = ["Artifact", "Location", "Character", "Event"];

let nextId = 5;

export default function App() {
  const [entries, setEntries] = useState<LoreEntry[]>(SEED_ENTRIES);
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [nameInput, setNameInput] = useState("");
  const [typeInput, setTypeInput] = useState<LoreType>("Artifact");
  const [descInput, setDescInput] = useState("");

  const totalEntries = entries.length;
  const favoritesCount = entries.filter((e) => e.favorite).length;

  const visibleEntries = entries.filter((e) => {
    if (typeFilter !== "All" && e.type !== typeFilter) return false;
    if (favoritesOnly && !e.favorite) return false;
    return true;
  });

  function handleAdd() {
    const trimName = nameInput.trim();
    const trimDesc = descInput.trim();
    if (!trimName || !trimDesc) return;
    const newEntry: LoreEntry = {
      id: nextId++,
      name: trimName,
      type: typeInput,
      description: trimDesc,
      favorite: false,
    };
    setEntries((prev) => [...prev, newEntry]);
    setNameInput("");
    setTypeInput("Artifact");
    setDescInput("");
  }

  function handleFavoriteToggle(id: number) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, favorite: !e.favorite } : e))
    );
  }

  function handleDelete(id: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div>
      <h1>Lore Tracker</h1>

      <div>
        <span data-testid="total-entries">{totalEntries}</span>
        <span data-testid="favorites-count">{favoritesCount}</span>
      </div>

      <div>
        <select
          data-testid="type-filter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All">All</option>
          {LORE_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          data-testid="favorites-filter-btn"
          onClick={() => setFavoritesOnly((prev) => !prev)}
        >
          {favoritesOnly ? "Show All" : "Show Favorites Only"}
        </button>
      </div>

      <div>
        <input
          data-testid="entry-name-input"
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Entry name"
        />
        <select
          data-testid="entry-type-input"
          value={typeInput}
          onChange={(e) => setTypeInput(e.target.value as LoreType)}
        >
          {LORE_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <textarea
          data-testid="entry-description-input"
          value={descInput}
          onChange={(e) => setDescInput(e.target.value)}
          placeholder="Description"
        />
        <button data-testid="add-entry-btn" onClick={handleAdd}>
          Add Entry
        </button>
      </div>

      <div>
        {visibleEntries.map((entry) => (
          <div key={entry.id} data-testid={`entry-card-${entry.id}`}>
            <span data-testid={`entry-name-${entry.id}`}>{entry.name}</span>
            <span data-testid={`entry-type-${entry.id}`}>{entry.type}</span>
            <span data-testid={`entry-description-${entry.id}`}>{entry.description}</span>
            <span data-testid={`entry-favorite-${entry.id}`}>
              {entry.favorite ? "Favorite" : "Not Favorite"}
            </span>
            <button
              data-testid={`favorite-toggle-${entry.id}`}
              onClick={() => handleFavoriteToggle(entry.id)}
            >
              {entry.favorite ? "Remove Favorite" : "Add Favorite"}
            </button>
            <button
              data-testid={`delete-entry-${entry.id}`}
              onClick={() => handleDelete(entry.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
