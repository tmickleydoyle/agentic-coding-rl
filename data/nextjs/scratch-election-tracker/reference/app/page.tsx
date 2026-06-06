import React, { useState } from "react";

interface Candidate {
  id: number;
  name: string;
  party: string;
  votes: number;
}

const SEED: Candidate[] = [
  { id: 1, name: "Alice Mercer", party: "Progressive", votes: 14200 },
  { id: 2, name: "Bob Harrington", party: "Conservative", votes: 13800 },
  { id: 3, name: "Carol Nguyen", party: "Independent", votes: 4100 },
];

function cloneSeed(): Candidate[] {
  return SEED.map((c) => ({ ...c }));
}

export default function App() {
  const [candidates, setCandidates] = useState<Candidate[]>(cloneSeed());
  const [selectedId, setSelectedId] = useState<string>("");
  const [votesInput, setVotesInput] = useState<string>("");

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
  const maxVotes = sorted.length > 0 ? sorted[0].votes : 0;

  function handleAddVotes() {
    const amount = parseInt(votesInput, 10);
    if (!selectedId || isNaN(amount) || amount <= 0) return;
    const id = parseInt(selectedId, 10);
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, votes: c.votes + amount } : c))
    );
    setVotesInput("");
  }

  function handleReset() {
    setCandidates(cloneSeed());
  }

  return (
    <div>
      <h1>Election Tracker</h1>
      <div>
        Total votes: <span data-testid="total-votes">{totalVotes}</span>
      </div>

      <div>
        {sorted.map((c) => {
          const pct = totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : "0.0";
          const isLeading = c.votes === maxVotes;
          return (
            <div key={c.id} data-testid="candidate-card">
              <span data-testid="candidate-name">{c.name}</span>
              <span data-testid="candidate-party">{c.party}</span>
              <span data-testid="candidate-votes">{c.votes}</span>
              <span data-testid="candidate-pct">{pct}%</span>
              {isLeading && <span data-testid="leading-badge">LEADING</span>}
            </div>
          );
        })}
      </div>

      <div>
        <select
          data-testid="candidate-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Select Candidate --</option>
          {candidates.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          data-testid="votes-input"
          value={votesInput}
          onChange={(e) => setVotesInput(e.target.value)}
          placeholder="Votes to add"
        />
        <button data-testid="add-votes-btn" onClick={handleAddVotes}>
          Add Votes
        </button>
      </div>

      <button data-testid="reset-btn" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}
