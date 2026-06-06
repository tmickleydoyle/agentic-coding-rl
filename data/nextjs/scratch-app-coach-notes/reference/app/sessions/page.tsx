import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function SessionsPage() {
  const { athletes, sessions, activeAthleteId, addSession } = useApp();
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [focus, setFocus] = useState("");

  const activeAthlete = athletes.find((a) => a.id === activeAthleteId);
  const athleteSessions = sessions.filter((s) => s.athleteId === activeAthleteId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeAthleteId) return;
    addSession(activeAthleteId, date, Number(duration), focus);
    setDate("");
    setDuration("");
    setFocus("");
  }

  if (!activeAthlete) {
    return (
      <div data-testid="sessions-page">
        <h1>Sessions</h1>
        <p data-testid="no-active-athlete">No active athlete</p>
      </div>
    );
  }

  return (
    <div data-testid="sessions-page">
      <h1>Sessions — {activeAthlete.name}</h1>
      <form data-testid="add-session-form" onSubmit={handleSubmit}>
        <input data-testid="input-session-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="input-session-duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (min)" />
        <input data-testid="input-session-focus" value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="Focus area" />
        <button type="submit" data-testid="btn-add-session">Add</button>
      </form>
      <ul data-testid="session-list">
        {athleteSessions.map((s) => (
          <li key={s.id} data-testid={`session-item-${s.id}`}>
            <span data-testid={`session-date-${s.id}`}>{s.date}</span>
            <span data-testid={`session-focus-${s.id}`}>{s.focus}</span>
            <span data-testid={`session-duration-${s.id}`}>{s.duration} min</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
