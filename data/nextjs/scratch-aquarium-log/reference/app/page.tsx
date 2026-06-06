import React, { useState } from "react";

interface Observation {
  id: number;
  tank: string;
  note: string;
  date: string;
}

const TANKS = ["Reef Tank", "Freshwater", "Quarantine", "Planted"];

const SEED_OBSERVATIONS: Observation[] = [
  { id: 1, tank: "Reef Tank", note: "Clownfish pair spawning near anemone", date: "2024-01-10" },
  { id: 2, tank: "Freshwater", note: "Noticed algae growth on back glass", date: "2024-01-11" },
  { id: 3, tank: "Reef Tank", note: "Coral polyps fully extended", date: "2024-01-12" },
  { id: 4, tank: "Quarantine", note: "New fish showing normal behavior", date: "2024-01-13" },
];

function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function App() {
  const [observations, setObservations] = useState<Observation[]>(SEED_OBSERVATIONS);
  const [tank, setTank] = useState<string>(TANKS[0]);
  const [note, setNote] = useState<string>("");
  const [date, setDate] = useState<string>(todayString());
  const [filter, setFilter] = useState<string>("All");
  const [nextId, setNextId] = useState<number>(5);

  const visible = filter === "All"
    ? observations
    : observations.filter((o) => o.tank === filter);

  function handleAdd() {
    if (note.trim() === "") return;
    const newObs: Observation = { id: nextId, tank, note: note.trim(), date };
    setObservations([...observations, newObs]);
    setNextId(nextId + 1);
    setNote("");
  }

  function handleDelete(id: number) {
    setObservations(observations.filter((o) => o.id !== id));
  }

  return (
    <div>
      <h1>Aquarium Log</h1>

      <section>
        <div>
          <label htmlFor="tank-select">Tank</label>
          <select
            id="tank-select"
            data-testid="tank-select"
            value={tank}
            onChange={(e) => setTank(e.target.value)}
          >
            {TANKS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="note-input">Note</label>
          <textarea
            id="note-input"
            data-testid="note-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="date-input">Date</label>
          <input
            id="date-input"
            type="date"
            data-testid="date-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button data-testid="add-button" onClick={handleAdd}>
          Add Entry
        </button>
      </section>

      <section>
        <label htmlFor="filter-select">Filter by Tank</label>
        <select
          id="filter-select"
          data-testid="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          {TANKS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </section>

      <div data-testid="obs-count">{visible.length} observations</div>

      <ul data-testid="observations-list">
        {visible.map((obs) => (
          <li key={obs.id} data-testid={`observation-${obs.id}`}>
            <span data-testid={`obs-tank-${obs.id}`}>{obs.tank}</span>
            <span data-testid={`obs-note-${obs.id}`}>{obs.note}</span>
            <span data-testid={`obs-date-${obs.id}`}>{obs.date}</span>
            <button
              data-testid={`delete-${obs.id}`}
              onClick={() => handleDelete(obs.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
