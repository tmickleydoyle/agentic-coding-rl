import React, { useState } from "react";
import { getSessions, getMentors, addSession } from "../../lib/store";

export function SessionsPage() {
  const [filter, setFilter] = useState("all");
  const [mentorId, setMentorId] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("60");
  const [notes, setNotes] = useState("");
  const [upcoming, setUpcoming] = useState(false);
  const [, forceUpdate] = useState(0);

  const mentors = getMentors();
  const sessions = getSessions();
  const filtered = filter === "all" ? sessions : sessions.filter((s) => s.mentorId === filter);
  const mentorMap = new Map<string, string>();
  mentors.forEach((m) => mentorMap.set(m.id, m.name));

  const handleAdd = () => {
    if (!mentorId || !date) return;
    addSession({ mentorId, date, duration: parseInt(duration), notes: notes.trim(), upcoming });
    setDate(""); setNotes(""); setUpcoming(false);
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="sessions-page">
      <h2>Sessions</h2>
      <select data-testid="mentor-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        {mentors.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
      {filtered.map((s) => (
        <div key={s.id} data-testid="session-item">
          <span data-testid="session-date">{s.date}</span>
          <span data-testid="session-duration">{s.duration}</span>
          <span data-testid="session-notes">{s.notes}</span>
          <span data-testid="session-mentor">{mentorMap.get(s.mentorId) ?? ""}</span>
          {s.upcoming && <span data-testid="upcoming-badge">Upcoming</span>}
        </div>
      ))}
      <div data-testid="add-session-form">
        <select data-testid="session-mentor-select" value={mentorId} onChange={(e) => setMentorId(e.target.value)}>
          <option value="">Select mentor</option>
          {mentors.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <input data-testid="session-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="session-duration-input" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <textarea data-testid="session-notes-input" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <input type="checkbox" data-testid="session-upcoming-input" checked={upcoming} onChange={(e) => setUpcoming(e.target.checked)} />
        <button data-testid="add-session-btn" onClick={handleAdd}>Add Session</button>
      </div>
    </div>
  );
}
