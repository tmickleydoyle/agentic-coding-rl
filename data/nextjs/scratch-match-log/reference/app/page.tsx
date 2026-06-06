import React, { useState } from "react";

type Result = "Win" | "Loss" | "Draw";

interface Match {
  id: number;
  date: string;
  opponent: string;
  ourScore: number;
  theirScore: number;
  result: Result;
}

function computeResult(our: number, their: number): Result {
  if (our > their) return "Win";
  if (our < their) return "Loss";
  return "Draw";
}

const SEED: Match[] = [
  { id: 1, date: "2024-03-01", opponent: "River City FC", ourScore: 3, theirScore: 1, result: "Win" },
  { id: 2, date: "2024-03-08", opponent: "Valley United", ourScore: 0, theirScore: 2, result: "Loss" },
  { id: 3, date: "2024-03-15", opponent: "Hilltop Rangers", ourScore: 2, theirScore: 2, result: "Draw" },
  { id: 4, date: "2024-03-22", opponent: "Eastside Eagles", ourScore: 4, theirScore: 0, result: "Win" },
  { id: 5, date: "2024-03-29", opponent: "Northern Wolves", ourScore: 1, theirScore: 3, result: "Loss" },
];

type FilterOption = "All" | Result;

export default function App() {
  const [matches, setMatches] = useState<Match[]>(SEED);
  const [filter, setFilter] = useState<FilterOption>("All");
  const [date, setDate] = useState("");
  const [opponent, setOpponent] = useState("");
  const [ourScore, setOurScore] = useState(0);
  const [theirScore, setTheirScore] = useState(0);
  const [nextId, setNextId] = useState(6);

  const wins = matches.filter((m) => m.result === "Win").length;
  const losses = matches.filter((m) => m.result === "Loss").length;
  const draws = matches.filter((m) => m.result === "Draw").length;

  const filtered = filter === "All" ? matches : matches.filter((m) => m.result === filter);

  function handleAdd() {
    if (!opponent.trim()) return;
    const result = computeResult(ourScore, theirScore);
    const newMatch: Match = { id: nextId, date, opponent: opponent.trim(), ourScore, theirScore, result };
    setMatches([newMatch, ...matches]);
    setNextId(nextId + 1);
    setDate("");
    setOpponent("");
    setOurScore(0);
    setTheirScore(0);
  }

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Match Log</h1>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <span>Wins: <strong data-testid="summary-wins">{wins}</strong></span>
        <span>Losses: <strong data-testid="summary-losses">{losses}</strong></span>
        <span>Draws: <strong data-testid="summary-draws">{draws}</strong></span>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="result-filter">Filter by Result</label>{" "}
        <select
          id="result-filter"
          data-testid="result-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterOption)}
        >
          <option value="All">All</option>
          <option value="Win">Win</option>
          <option value="Loss">Loss</option>
          <option value="Draw">Draw</option>
        </select>
      </div>

      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          type="date"
          data-testid="input-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date"
        />
        <input
          type="text"
          data-testid="input-opponent"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
          placeholder="Opponent"
        />
        <input
          type="number"
          data-testid="input-our-score"
          value={ourScore}
          onChange={(e) => setOurScore(Number(e.target.value))}
          min={0}
        />
        <input
          type="number"
          data-testid="input-their-score"
          value={theirScore}
          onChange={(e) => setTheirScore(Number(e.target.value))}
          min={0}
        />
        <button data-testid="btn-add-match" onClick={handleAdd}>Add Match</button>
      </div>

      <div>
        {filtered.map((m) => (
          <div
            key={m.id}
            data-testid="match-entry"
            style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "0.75rem", marginBottom: "0.5rem" }}
          >
            <span data-testid="entry-date">{m.date}</span>{" | "}
            <span data-testid="entry-opponent">{m.opponent}</span>{" | "}
            <span data-testid="entry-our-score">{m.ourScore}</span>
            {" - "}
            <span data-testid="entry-their-score">{m.theirScore}</span>{" | "}
            <strong data-testid="entry-result">{m.result}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
