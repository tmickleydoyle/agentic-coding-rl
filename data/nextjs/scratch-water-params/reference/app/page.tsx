import React, { useState } from "react";

interface Reading {
  id: number;
  tank: string;
  ph: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  date: string;
}

const TANKS = ["Reef Tank", "Freshwater", "Quarantine", "Planted"];

const SEED_READINGS: Reading[] = [
  { id: 1, tank: "Reef Tank", ph: 8.2, ammonia: 0.0, nitrite: 0.0, nitrate: 5.0, date: "2024-01-10" },
  { id: 2, tank: "Freshwater", ph: 7.0, ammonia: 0.25, nitrite: 0.0, nitrate: 20.0, date: "2024-01-11" },
  { id: 3, tank: "Reef Tank", ph: 8.3, ammonia: 0.0, nitrite: 0.05, nitrate: 2.0, date: "2024-01-12" },
];

function isSafe(r: Reading): boolean {
  return r.ph >= 6.5 && r.ph <= 8.5
    && r.ammonia >= 0.0 && r.ammonia <= 0.25
    && r.nitrite >= 0.0 && r.nitrite <= 0.1
    && r.nitrate >= 0.0 && r.nitrate <= 40.0;
}

function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function App() {
  const [readings, setReadings] = useState<Reading[]>(SEED_READINGS);
  const [tank, setTank] = useState<string>(TANKS[0]);
  const [ph, setPh] = useState<string>("");
  const [ammonia, setAmmonia] = useState<string>("");
  const [nitrite, setNitrite] = useState<string>("");
  const [nitrate, setNitrate] = useState<string>("");
  const [date, setDate] = useState<string>(todayString());
  const [filter, setFilter] = useState<string>("All");
  const [nextId, setNextId] = useState<number>(4);

  const visible = filter === "All"
    ? readings
    : readings.filter((r) => r.tank === filter);

  function handleRecord() {
    if (ph === "" || ammonia === "" || nitrite === "" || nitrate === "") return;
    const phNum = parseFloat(ph);
    const ammoniaNum = parseFloat(ammonia);
    const nitriteNum = parseFloat(nitrite);
    const nitrateNum = parseFloat(nitrate);
    if (isNaN(phNum) || isNaN(ammoniaNum) || isNaN(nitriteNum) || isNaN(nitrateNum)) return;
    const newReading: Reading = {
      id: nextId,
      tank,
      ph: phNum,
      ammonia: ammoniaNum,
      nitrite: nitriteNum,
      nitrate: nitrateNum,
      date,
    };
    setReadings([...readings, newReading]);
    setNextId(nextId + 1);
    setPh("");
    setAmmonia("");
    setNitrite("");
    setNitrate("");
  }

  function handleDelete(id: number) {
    setReadings(readings.filter((r) => r.id !== id));
  }

  return (
    <div>
      <h1>Water Parameters</h1>

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
          <label htmlFor="ph-input">pH</label>
          <input
            id="ph-input"
            type="number"
            step="0.1"
            data-testid="ph-input"
            value={ph}
            onChange={(e) => setPh(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ammonia-input">Ammonia (ppm)</label>
          <input
            id="ammonia-input"
            type="number"
            step="0.01"
            data-testid="ammonia-input"
            value={ammonia}
            onChange={(e) => setAmmonia(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="nitrite-input">Nitrite (ppm)</label>
          <input
            id="nitrite-input"
            type="number"
            step="0.01"
            data-testid="nitrite-input"
            value={nitrite}
            onChange={(e) => setNitrite(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="nitrate-input">Nitrate (ppm)</label>
          <input
            id="nitrate-input"
            type="number"
            step="0.1"
            data-testid="nitrate-input"
            value={nitrate}
            onChange={(e) => setNitrate(e.target.value)}
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
        <button data-testid="record-button" onClick={handleRecord}>
          Record Reading
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

      <div data-testid="reading-count">{visible.length} readings</div>

      <ul data-testid="readings-list">
        {visible.map((r) => (
          <li key={r.id} data-testid={`reading-${r.id}`}>
            <span data-testid={`reading-tank-${r.id}`}>{r.tank}</span>
            <span data-testid={`reading-ph-${r.id}`}>{r.ph}</span>
            <span data-testid={`reading-ammonia-${r.id}`}>{r.ammonia}</span>
            <span data-testid={`reading-nitrite-${r.id}`}>{r.nitrite}</span>
            <span data-testid={`reading-nitrate-${r.id}`}>{r.nitrate}</span>
            <span data-testid={`reading-date-${r.id}`}>{r.date}</span>
            <span data-testid={`reading-status-${r.id}`}>{isSafe(r) ? "safe" : "warning"}</span>
            <button
              data-testid={`delete-${r.id}`}
              onClick={() => handleDelete(r.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
