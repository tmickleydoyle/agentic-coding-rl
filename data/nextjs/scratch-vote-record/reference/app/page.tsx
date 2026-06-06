import React, { useState } from "react";

interface Voter {
  id: number;
  name: string;
  precinct: string;
  counted: boolean;
}

const SEED: Voter[] = [
  { id: 1, name: "James Okafor", precinct: "4A", counted: false },
  { id: 2, name: "Priya Sharma", precinct: "2B", counted: true },
  { id: 3, name: "Luis Delgado", precinct: "4A", counted: false },
  { id: 4, name: "Sandra Kowalski", precinct: "3C", counted: true },
  { id: 5, name: "Tommy Nguyen", precinct: "2B", counted: false },
];

export default function App() {
  const [voters, setVoters] = useState<Voter[]>(SEED.map((v) => ({ ...v })));
  const [filter, setFilter] = useState<string>("");
  const [nameInput, setNameInput] = useState<string>("");
  const [precinctInput, setPrecinctInput] = useState<string>("");
  const [nextId, setNextId] = useState<number>(6);

  const totalCount = voters.length;
  const countedCount = voters.filter((v) => v.counted).length;
  const uncountedCount = totalCount - countedCount;

  const filtered = voters.filter((v) =>
    v.precinct.toLowerCase().includes(filter.toLowerCase())
  );

  function handleToggle(id: number) {
    setVoters((prev) =>
      prev.map((v) => (v.id === id ? { ...v, counted: !v.counted } : v))
    );
  }

  function handleRemove(id: number) {
    setVoters((prev) => prev.filter((v) => v.id !== id));
  }

  function handleAdd() {
    if (!nameInput.trim() || !precinctInput.trim()) return;
    const newVoter: Voter = {
      id: nextId,
      name: nameInput.trim(),
      precinct: precinctInput.trim(),
      counted: false,
    };
    setVoters((prev) => [...prev, newVoter]);
    setNextId((n) => n + 1);
    setNameInput("");
    setPrecinctInput("");
  }

  return (
    <div>
      <h1>Vote Record Manager</h1>
      <div>
        <span>Total: <span data-testid="total-count">{totalCount}</span></span>
        <span>Counted: <span data-testid="counted-count">{countedCount}</span></span>
        <span>Uncounted: <span data-testid="uncounted-count">{uncountedCount}</span></span>
      </div>

      <div>
        <label htmlFor="precinct-filter">Filter by Precinct</label>
        <input
          id="precinct-filter"
          data-testid="precinct-filter"
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by precinct"
        />
      </div>

      <div>
        {filtered.map((v) => (
          <div key={v.id} data-testid="voter-row">
            <span data-testid="voter-name">{v.name}</span>
            <span data-testid="voter-precinct">{v.precinct}</span>
            <input
              type="checkbox"
              data-testid="counted-checkbox"
              checked={v.counted}
              onChange={() => handleToggle(v.id)}
            />
            <button data-testid="remove-btn" onClick={() => handleRemove(v.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          data-testid="name-input"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Voter name"
        />
        <input
          type="text"
          data-testid="precinct-input"
          value={precinctInput}
          onChange={(e) => setPrecinctInput(e.target.value)}
          placeholder="Precinct (e.g. 4A)"
        />
        <button data-testid="add-voter-btn" onClick={handleAdd}>
          Add Voter
        </button>
      </div>
    </div>
  );
}
