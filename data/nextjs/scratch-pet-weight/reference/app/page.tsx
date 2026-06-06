import React, { useState } from "react";

interface WeightEntry {
  date: string;
  weight: number;
}

interface Pet {
  id: number;
  name: string;
  species: string;
  entries: WeightEntry[];
}

const INITIAL_PETS: Pet[] = [
  {
    id: 1,
    name: "Whiskers",
    species: "Cat",
    entries: [
      { date: "2024-01-01", weight: 9.2 },
      { date: "2024-02-01", weight: 9.5 },
      { date: "2024-03-01", weight: 9.8 },
    ],
  },
  {
    id: 2,
    name: "Rex",
    species: "Dog",
    entries: [
      { date: "2024-01-01", weight: 45.0 },
      { date: "2024-02-01", weight: 46.5 },
      { date: "2024-03-01", weight: 44.0 },
    ],
  },
  {
    id: 3,
    name: "Peanut",
    species: "Rabbit",
    entries: [
      { date: "2024-01-01", weight: 3.1 },
      { date: "2024-02-01", weight: 3.0 },
      { date: "2024-03-01", weight: 3.2 },
    ],
  },
];

function getTrend(entries: WeightEntry[], index: number): string {
  if (index === 0) return "—";
  const curr = entries[index].weight;
  const prev = entries[index - 1].weight;
  if (curr > prev) return "↑";
  if (curr < prev) return "↓";
  return "—";
}

export default function App() {
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [selectedPetId, setSelectedPetId] = useState<number>(1);
  const [dateInput, setDateInput] = useState("");
  const [weightInput, setWeightInput] = useState("");

  const selectedPet = pets.find((p) => p.id === selectedPetId)!;
  const sortedEntries = [...selectedPet.entries].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  function selectPet(id: number) {
    setSelectedPetId(id);
    setDateInput("");
    setWeightInput("");
  }

  function addEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!dateInput || !weightInput) return;
    const w = parseFloat(weightInput);
    if (isNaN(w) || w <= 0) return;
    const entry: WeightEntry = { date: dateInput, weight: w };
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id !== selectedPetId) return pet;
        return { ...pet, entries: [...pet.entries, entry] };
      })
    );
    setDateInput("");
    setWeightInput("");
  }

  function deleteEntry(index: number) {
    const entryToDelete = sortedEntries[index];
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id !== selectedPetId) return pet;
        let removed = false;
        const newEntries = pet.entries.filter((e) => {
          if (!removed && e.date === entryToDelete.date && e.weight === entryToDelete.weight) {
            removed = true;
            return false;
          }
          return true;
        });
        return { ...pet, entries: newEntries };
      })
    );
  }

  function getTrendSummary(): string {
    if (sortedEntries.length < 2) return "No data";
    const last = sortedEntries[sortedEntries.length - 1].weight;
    const prev = sortedEntries[sortedEntries.length - 2].weight;
    if (last > prev) return "Up";
    if (last < prev) return "Down";
    return "Stable";
  }

  return (
    <div>
      <h1>Pet Weight Tracker</h1>

      <div data-testid="pet-selector">
        {pets.map((pet) => (
          <button
            key={pet.id}
            data-testid={`pet-btn-${pet.name.toLowerCase()}`}
            onClick={() => selectPet(pet.id)}
            style={{ fontWeight: selectedPetId === pet.id ? "bold" : "normal" }}
          >
            {pet.name}
          </button>
        ))}
      </div>

      <div data-testid="pet-info">
        <span data-testid="pet-name">{selectedPet.name}</span>
        {" — "}
        <span data-testid="pet-species">{selectedPet.species}</span>
      </div>

      {sortedEntries.length === 0 ? (
        <p data-testid="no-weight-msg">No weight entries yet</p>
      ) : (
        <table data-testid="weight-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Weight (lbs)</th>
              <th>Trend</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry, i) => (
              <tr key={i} data-testid={`weight-row-${i}`}>
                <td>{entry.date}</td>
                <td>{entry.weight}</td>
                <td data-testid={`trend-${i}`}>{getTrend(sortedEntries, i)}</td>
                <td>
                  <button
                    data-testid={`delete-weight-${i}`}
                    onClick={() => deleteEntry(i)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div data-testid="trend-summary-section">
        <span data-testid="latest-weight">
          Latest: {sortedEntries.length > 0 ? sortedEntries[sortedEntries.length - 1].weight : "N/A"} lbs
        </span>
        {" | "}
        <span data-testid="trend-summary">Trend: {getTrendSummary()}</span>
      </div>

      <form onSubmit={addEntry} data-testid="add-weight-form">
        <h2>Add Weight Entry</h2>
        <label>
          Date
          <input
            type="date"
            data-testid="weight-date-input"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
        </label>
        <label>
          Weight (lbs)
          <input
            type="number"
            step="0.1"
            data-testid="weight-value-input"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
          />
        </label>
        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
}
