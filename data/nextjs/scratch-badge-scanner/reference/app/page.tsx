import { useState } from "react";

interface Session {
  id: string;
  name: string;
  room: string;
  capacity: number;
}

interface Attendee {
  badgeId: string;
  name: string;
}

const SESSIONS: Session[] = [
  { id: "s1", name: "React Patterns in 2025", room: "Room A", capacity: 3 },
  { id: "s2", name: "Scaling Microservices", room: "Room B", capacity: 4 },
  { id: "s3", name: "Designing for Accessibility", room: "Room C", capacity: 3 },
];

const ATTENDEES: Attendee[] = [
  { badgeId: "A001", name: "Alice Tran" },
  { badgeId: "A002", name: "Ben Okafor" },
  { badgeId: "A003", name: "Cara White" },
  { badgeId: "A004", name: "David Kim" },
  { badgeId: "A005", name: "Eva Russo" },
  { badgeId: "A006", name: "Frank Liu" },
];

export default function App() {
  const [activeSessionId, setActiveSessionId] = useState<string>(SESSIONS[0].id);
  const [checkedIn, setCheckedIn] = useState<Record<string, string[]>>({ s1: [], s2: [], s3: [] });
  const [badgeInput, setBadgeInput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const activeSession = SESSIONS.find((s) => s.id === activeSessionId) as Session;
  const currentCheckedIn = checkedIn[activeSessionId] || [];

  const handleCheckIn = () => {
    const badge = badgeInput.trim();
    const attendee = ATTENDEES.find((a) => a.badgeId === badge);
    if (!attendee) {
      setError("Unknown badge ID");
      return;
    }
    if (currentCheckedIn.includes(badge)) {
      setError("Already checked in");
      return;
    }
    if (currentCheckedIn.length >= activeSession.capacity) {
      setError("Session is full");
      return;
    }
    setCheckedIn({ ...checkedIn, [activeSessionId]: [...currentCheckedIn, badge] });
    setBadgeInput("");
    setError("");
  };

  const handleCheckOut = (badge: string) => {
    setCheckedIn({ ...checkedIn, [activeSessionId]: currentCheckedIn.filter((b) => b !== badge) });
  };

  return (
    <main>
      <h1>Badge Scanner</h1>

      <select
        data-testid="session-select"
        aria-label="Select session"
        value={activeSessionId}
        onChange={(e) => { setActiveSessionId(e.target.value); setError(""); }}
      >
        {SESSIONS.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <div data-testid="checkin-form">
        <input
          data-testid="badge-input"
          aria-label="Badge ID"
          value={badgeInput}
          onChange={(e) => { setBadgeInput(e.target.value); setError(""); }}
          placeholder="Badge ID"
        />
        <button data-testid="checkin-btn" onClick={handleCheckIn}>Check In</button>
      </div>

      {error && <p data-testid="error-message">{error}</p>}

      <p data-testid="attendance-count">{currentCheckedIn.length} / {activeSession.capacity} checked in</p>

      <ul data-testid="checkedin-list">
        {currentCheckedIn.map((badge) => {
          const att = ATTENDEES.find((a) => a.badgeId === badge) as Attendee;
          return (
            <li key={badge} data-testid={`checkedin-${badge}`}>
              <span data-testid={`checkedin-badge-${badge}`}>{badge}</span>
              <span data-testid={`checkedin-name-${badge}`}>{att.name}</span>
              <button data-testid={`checkout-btn-${badge}`} onClick={() => handleCheckOut(badge)}>Check Out</button>
            </li>
          );
        })}
      </ul>

      <table data-testid="session-summary">
        <thead>
          <tr>
            <th>Session Name</th>
            <th>Room</th>
            <th>Checked In</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody>
          {SESSIONS.map((s) => (
            <tr key={s.id} data-testid={`summary-row-${s.id}`}>
              <td data-testid={`summary-name-${s.id}`}>{s.name}</td>
              <td data-testid={`summary-room-${s.id}`}>{s.room}</td>
              <td data-testid={`summary-count-${s.id}`}>{(checkedIn[s.id] || []).length}</td>
              <td data-testid={`summary-capacity-${s.id}`}>{s.capacity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
