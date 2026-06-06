import React, { useState } from "react";

type Position = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";

interface Player {
  id: number;
  jersey: number;
  name: string;
  position: Position;
  age: number;
}

const SEED: Player[] = [
  { id: 1, jersey: 1, name: "Alex Rivera", position: "Goalkeeper", age: 28 },
  { id: 2, jersey: 5, name: "Priya Sharma", position: "Defender", age: 24 },
  { id: 3, jersey: 8, name: "James O'Brien", position: "Midfielder", age: 26 },
  { id: 4, jersey: 10, name: "Sofia Martinez", position: "Forward", age: 22 },
  { id: 5, jersey: 14, name: "Kevin Park", position: "Defender", age: 27 },
  { id: 6, jersey: 17, name: "Dana Lee", position: "Midfielder", age: 23 },
  { id: 7, jersey: 23, name: "Carlos Mendes", position: "Forward", age: 25 },
];

type FilterOption = "All" | Position;

export default function App() {
  const [players, setPlayers] = useState<Player[]>(SEED);
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState<FilterOption>("All");
  const [jersey, setJersey] = useState<number | "">(``);
  const [name, setName] = useState("");
  const [position, setPosition] = useState<Position>("Goalkeeper");
  const [age, setAge] = useState<number | "">(``);
  const [nextId, setNextId] = useState(8);

  const visible = players.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchPos = posFilter === "All" || p.position === posFilter;
    return matchSearch && matchPos;
  });

  function handleAdd() {
    if (!name.trim() || !jersey) return;
    const newPlayer: Player = {
      id: nextId,
      jersey: Number(jersey),
      name: name.trim(),
      position,
      age: Number(age) || 0,
    };
    setPlayers([newPlayer, ...players]);
    setNextId(nextId + 1);
    setJersey(``);
    setName("");
    setAge(``);
  }

  function handleRemove(id: number) {
    setPlayers(players.filter((p) => p.id !== id));
  }

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Team Roster</h1>

      <p data-testid="player-count">{visible.length} players</p>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          data-testid="search-input"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label htmlFor="position-filter">Position</label>{" "}
        <select
          id="position-filter"
          data-testid="position-filter"
          value={posFilter}
          onChange={(e) => setPosFilter(e.target.value as FilterOption)}
        >
          <option value="All">All</option>
          <option value="Goalkeeper">Goalkeeper</option>
          <option value="Defender">Defender</option>
          <option value="Midfielder">Midfielder</option>
          <option value="Forward">Forward</option>
        </select>
      </div>

      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          type="number"
          data-testid="input-jersey"
          placeholder="Jersey #"
          value={jersey}
          onChange={(e) => setJersey(e.target.value === "" ? "" : Number(e.target.value))}
          min={1}
        />
        <input
          type="text"
          data-testid="input-name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          data-testid="input-position"
          value={position}
          onChange={(e) => setPosition(e.target.value as Position)}
        >
          <option value="Goalkeeper">Goalkeeper</option>
          <option value="Defender">Defender</option>
          <option value="Midfielder">Midfielder</option>
          <option value="Forward">Forward</option>
        </select>
        <input
          type="number"
          data-testid="input-age"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
          min={0}
        />
        <button data-testid="btn-add-player" onClick={handleAdd}>Add Player</button>
      </div>

      <div>
        {visible.map((p) => (
          <div
            key={p.id}
            data-testid="player-card"
            style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "0.75rem", marginBottom: "0.5rem", display: "flex", gap: "1rem", alignItems: "center" }}
          >
            <span data-testid="card-jersey">#{p.jersey}</span>
            <span data-testid="card-name">{p.name}</span>
            <span data-testid="card-position">{p.position}</span>
            <span data-testid="card-age">Age {p.age}</span>
            <button data-testid="btn-remove" onClick={() => handleRemove(p.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
