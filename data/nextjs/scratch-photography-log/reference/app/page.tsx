import React, { useState } from "react";

interface Session {
  id: number;
  date: string;
  location: string;
  camera: string;
  notes: string;
}

const SEED_SESSIONS: Session[] = [
  { id: 1, date: "2024-03-15", location: "Central Park", camera: "Sony A7III", notes: "Golden hour portraits" },
  { id: 2, date: "2024-04-02", location: "Brooklyn Bridge", camera: "Canon R5", notes: "Long exposure at night" },
  { id: 3, date: "2024-05-10", location: "Coney Island", camera: "Fuji X-T4", notes: "Street photography" },
];

export default function App() {
  const [sessions, setSessions] = useState<Session[]>(SEED_SESSIONS);
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [camera, setCamera] = useState("");
  const [notes, setNotes] = useState("");
  const [nextId, setNextId] = useState(4);

  const sorted = [...sessions].sort((a, b) => (a.date > b.date ? -1 : 1));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date.trim() || !location.trim() || !camera.trim()) return;
    const newSession: Session = { id: nextId, date: date.trim(), location: location.trim(), camera: camera.trim(), notes: notes.trim() };
    setSessions((prev) => [...prev, newSession]);
    setNextId((n) => n + 1);
    setDate("");
    setLocation("");
    setCamera("");
    setNotes("");
  }

  function deleteSession(id: number) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <h1>Photography Log</h1>
      <p data-testid="session-count">{sessions.length} sessions</p>

      <form onSubmit={handleSubmit} data-testid="add-form">
        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            data-testid="input-date"
          />
        </div>
        <div>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            data-testid="input-location"
          />
        </div>
        <div>
          <label htmlFor="camera">Camera</label>
          <input
            id="camera"
            type="text"
            value={camera}
            onChange={(e) => setCamera(e.target.value)}
            data-testid="input-camera"
          />
        </div>
        <div>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            data-testid="input-notes"
          />
        </div>
        <button type="submit" data-testid="submit-btn">Add Session</button>
      </form>

      <ul data-testid="session-list">
        {sorted.map((s) => (
          <li key={s.id} data-testid={`session-${s.id}`}>
            <span data-testid={`session-date-${s.id}`}>{s.date}</span>
            <span data-testid={`session-location-${s.id}`}>{s.location}</span>
            <span data-testid={`session-camera-${s.id}`}>{s.camera}</span>
            {s.notes && <span data-testid={`session-notes-${s.id}`}>{s.notes}</span>}
            <button
              onClick={() => deleteSession(s.id)}
              data-testid={`delete-${s.id}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
