'use client';
import React, { useState } from 'react';

export function SubmitPage() {
  const [player, setPlayer] = useState('');
  const [game, setGame] = useState('Chess');
  const [score, setScore] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (!player.trim()) { setError('Player is required'); return; }
    const numScore = Number(score);
    if (!score || isNaN(numScore) || numScore < 0) { setError('Valid score (>=0) is required'); return; }
    const res = await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player, game, score: numScore }),
    });
    if (res.ok) {
      setPlayer(''); setScore(''); setGame('Chess'); setError(''); setSuccess(true);
    }
  }

  return (
    <div data-testid="submit-page">
      <h1>Submit Score</h1>
      {success && <div data-testid="success-msg">Score submitted!</div>}
      <input data-testid="player-input" value={player} onChange={(e) => { setPlayer(e.target.value); setSuccess(false); }} placeholder="Player name" />
      <select data-testid="game-select" value={game} onChange={(e) => setGame(e.target.value)}>
        <option value="Chess">Chess</option>
        <option value="Trivia">Trivia</option>
        <option value="Puzzle">Puzzle</option>
        <option value="Racing">Racing</option>
      </select>
      <input data-testid="score-input" type="number" value={score} onChange={(e) => { setScore(e.target.value); setSuccess(false); }} placeholder="Score" />
      {error && <span data-testid="form-error">{error}</span>}
      <button data-testid="submit-btn" onClick={handleSubmit}>Submit</button>
    </div>
  );
}
