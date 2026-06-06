"use client";
import React, { useState } from "react";
import { getAthletes, getSessions, addSession } from "../../lib/store";

export function SessionsPage() {
  const [, rerender] = useState(0);
  const [athleteId, setAthleteId] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [score, setScore] = useState("");
  const [error, setError] = useState("");
  const athletes = getAthletes();
  const sessions = getSessions();

  function handleAdd() {
    const aid = parseInt(athleteId);
    const dur = parseInt(duration);
    const sc = parseInt(score);
    const result = addSession(aid, date, dur, sc);
    if (!result) {
      setError("Invalid input: duration must be > 0, score must be 1-10");
      return;
    }
    setError("");
    setAthleteId("");
    setDate("");
    setDuration("");
    setScore("");
    rerender((n) => n + 1);
  }

  return (
    <div data-testid="sessions-page">
      <h2>Sessions</h2>
      <select data-testid="session-athlete-select" value={athleteId} onChange={(e) => setAthleteId(e.target.value)}>
        <option value="">Select athlete</option>
        {athletes.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
      <input data-testid="session-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input data-testid="session-duration-input" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (min)" />
      <input data-testid="session-score-input" type="number" value={score} onChange={(e) => setScore(e.target.value)} placeholder="Score (1-10)" />
      <button data-testid="add-session-btn" onClick={handleAdd}>Log Session</button>
      {error && <div data-testid="session-error">{error}</div>}
      <ul data-testid="session-list">
        {sessions.map((s) => (
          <li key={s.id} data-testid={`session-item-${s.id}`}>
            <span data-testid={`session-athlete-${s.id}`}>{s.athleteId}</span>
            <span data-testid={`session-date-${s.id}`}>{s.date}</span>
            <span data-testid={`session-duration-${s.id}`}>{s.duration}</span>
            <span data-testid={`session-score-${s.id}`}>{s.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
