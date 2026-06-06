import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { addSession } from "../../lib/store";
import type { MeetingFormat } from "../../lib/types";

const FORMATS: MeetingFormat[] = ["in-person", "online", "hybrid"];

export default function SessionsPage() {
  const { sessions, setSessions, groups } = useApp();
  const [groupId, setGroupId] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [format, setFormat] = useState<MeetingFormat>("online");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!groupId || !topic.trim() || !date || !duration) { setError("All fields required"); return; }
    const mins = parseInt(duration, 10);
    if (isNaN(mins) || mins <= 0) { setError("Duration must be positive"); return; }
    const group = groups.find(g => g.id === groupId);
    if (!group) { setError("Group not found"); return; }
    const s = addSession({ groupId, groupName: group.name, topic: topic.trim(), date, durationMinutes: mins, format });
    setSessions([...sessions, s]);
    setGroupId(""); setTopic(""); setDate(""); setDuration(""); setError("");
  }

  return (
    <div data-testid="sessions-page">
      <h2>Study Sessions</h2>
      {error && <div data-testid="session-error">{error}</div>}
      <ul data-testid="session-list">
        {sessions.map(s => (
          <li key={s.id} data-testid={`session-item-${s.id}`}>
            <span data-testid={`session-group-${s.id}`}>{s.groupName}</span>
            <span data-testid={`session-topic-${s.id}`}>{s.topic}</span>
            <span data-testid={`session-date-${s.id}`}>{s.date}</span>
            <span data-testid={`session-duration-${s.id}`}>{s.durationMinutes}min</span>
          </li>
        ))}
      </ul>
      <div data-testid="add-session-form">
        <select data-testid="select-group" value={groupId} onChange={e => setGroupId(e.target.value)}>
          <option value="">Select group</option>
          {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <input data-testid="input-topic" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic" />
        <input data-testid="input-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input data-testid="input-duration" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (min)" />
        <select data-testid="select-session-format" value={format} onChange={e => setFormat(e.target.value as MeetingFormat)}>
          {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <button data-testid="btn-add-session" onClick={handleAdd}>Add Session</button>
      </div>
    </div>
  );
}
