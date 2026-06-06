import React, { useState } from "react";

interface Tank {
  id: number;
  name: string;
  fishCount: number;
}

interface Feeding {
  id: number;
  tankId: number;
  amount: string;
  food: string;
  time: string;
}

const TANKS: Tank[] = [
  { id: 1, name: "Reef Tank", fishCount: 8 },
  { id: 2, name: "Freshwater", fishCount: 12 },
  { id: 3, name: "Quarantine", fishCount: 2 },
  { id: 4, name: "Planted", fishCount: 6 },
];

const SEED_FEEDINGS: Feeding[] = [
  { id: 1, tankId: 1, amount: "1 pinch", food: "Flake", time: "08:00" },
  { id: 2, tankId: 2, amount: "2 pinches", food: "Pellet", time: "08:30" },
  { id: 3, tankId: 1, amount: "1 pinch", food: "Frozen Mysis", time: "17:00" },
];

export default function App() {
  const [feedings, setFeedings] = useState<Feeding[]>(SEED_FEEDINGS);
  const [selectedTankId, setSelectedTankId] = useState<number>(1);
  const [food, setFood] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [nextId, setNextId] = useState<number>(4);

  function getTankName(id: number): string {
    const t = TANKS.find((tank) => tank.id === id);
    return t ? t.name : "";
  }

  function getFeedingCount(tankId: number): number {
    return feedings.filter((f) => f.tankId === tankId).length;
  }

  function handleLog() {
    if (food.trim() === "" || amount.trim() === "") return;
    const newFeeding: Feeding = {
      id: nextId,
      tankId: selectedTankId,
      amount: amount.trim(),
      food: food.trim(),
      time,
    };
    setFeedings([...feedings, newFeeding]);
    setNextId(nextId + 1);
    setFood("");
    setAmount("");
  }

  function handleDelete(id: number) {
    setFeedings(feedings.filter((f) => f.id !== id));
  }

  return (
    <div>
      <h1>Fish Feeding Tracker</h1>

      <section>
        <div>
          <label htmlFor="tank-select">Tank</label>
          <select
            id="tank-select"
            data-testid="tank-select"
            value={selectedTankId}
            onChange={(e) => setSelectedTankId(Number(e.target.value))}
          >
            {TANKS.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="food-input">Food Type</label>
          <input
            id="food-input"
            type="text"
            data-testid="food-input"
            value={food}
            onChange={(e) => setFood(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="amount-input">Amount</label>
          <input
            id="amount-input"
            type="text"
            data-testid="amount-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="time-input">Time</label>
          <input
            id="time-input"
            type="time"
            data-testid="time-input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <button data-testid="log-button" onClick={handleLog}>
          Log Feeding
        </button>
      </section>

      <ul data-testid="tanks-list">
        {TANKS.map((t) => (
          <li key={t.id}>
            <span data-testid={`tank-name-${t.id}`}>{t.name}</span>
            <span data-testid={`tank-fish-count-${t.id}`}>{t.fishCount}</span>
            <span data-testid={`tank-feeding-count-${t.id}`}>{getFeedingCount(t.id)}</span>
          </li>
        ))}
      </ul>

      <div data-testid="total-feedings">{feedings.length} feedings logged</div>

      <ul data-testid="feedings-list">
        {feedings.map((f) => (
          <li key={f.id} data-testid={`feeding-${f.id}`}>
            <span data-testid={`feeding-tank-${f.id}`}>{getTankName(f.tankId)}</span>
            <span data-testid={`feeding-food-${f.id}`}>{f.food}</span>
            <span data-testid={`feeding-amount-${f.id}`}>{f.amount}</span>
            <span data-testid={`feeding-time-${f.id}`}>{f.time}</span>
            <button
              data-testid={`delete-feeding-${f.id}`}
              onClick={() => handleDelete(f.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
