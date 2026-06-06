"use client";
import React, { useState } from "react";
import { getGames, addGame } from "../../lib/store";
export function GamesPage() {
  const [, rerender] = useState(0);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [opponent, setOpponent] = useState("");
  const [ourScore, setOurScore] = useState("");
  const [theirScore, setTheirScore] = useState("");
  const [error, setError] = useState("");
  const games = getGames();
  function handleAdd() {
    const g = addGame(title.trim(), date, opponent.trim(), parseInt(ourScore), parseInt(theirScore));
    if (!g) { setError("Invalid: scores must be >= 0"); return; }
    setError(""); setTitle(""); setDate(""); setOpponent(""); setOurScore(""); setTheirScore("");
    rerender((n) => n + 1);
  }
  return (
    <div data-testid="games-page">
      <h2>Games</h2>
      <input data-testid="game-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input data-testid="game-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input data-testid="game-opponent-input" value={opponent} onChange={(e) => setOpponent(e.target.value)} placeholder="Opponent" />
      <input data-testid="game-our-score-input" type="number" value={ourScore} onChange={(e) => setOurScore(e.target.value)} placeholder="Our Score" />
      <input data-testid="game-their-score-input" type="number" value={theirScore} onChange={(e) => setTheirScore(e.target.value)} placeholder="Their Score" />
      <button data-testid="add-game-btn" onClick={handleAdd}>Add Game</button>
      {error && <div data-testid="game-error">{error}</div>}
      <ul data-testid="game-list">
        {games.map((g) => (
          <li key={g.id} data-testid={`game-item-${g.id}`}>
            <span data-testid={`game-title-${g.id}`}>{g.title}</span>
            <span data-testid={`game-opponent-${g.id}`}>{g.opponent}</span>
            <span data-testid={`game-score-${g.id}`}>{g.ourScore}-{g.theirScore}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
