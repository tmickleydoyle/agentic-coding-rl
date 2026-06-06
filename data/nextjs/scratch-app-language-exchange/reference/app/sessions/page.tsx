import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { addSession, deleteSession } from "../../lib/store";
import type { Language } from "../../lib/types";

const LANGUAGES: Language[] = ["Spanish", "French", "German", "Japanese", "Mandarin", "Portuguese"];

export default function SessionsPage() {
  const { sessions, setSessions, partners } = useApp();
  const [partnerId, setPartnerId] = useState("");
  const [language, setLanguage] = useState<Language>("Spanish");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!partnerId || !date || !duration) { setError("Partner, date, and duration required"); return; }
    const mins = parseInt(duration, 10);
    if (isNaN(mins) || mins <= 0) { setError("Duration must be positive number"); return; }
    const partner = partners.find(p => p.id === partnerId);
    if (!partner) { setError("Partner not found"); return; }
    const s = addSession({ partnerId, partnerName: partner.name, language, date, durationMinutes: mins, notes });
    setSessions([...sessions, s]);
    setPartnerId(""); setDate(""); setDuration(""); setNotes(""); setError("");
  }

  function handleDelete(id: string) {
    deleteSession(id);
    setSessions(sessions.filter(s => s.id !== id));
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <div data-testid="sessions-page">
      <h2>Practice Sessions</h2>
      <div data-testid="total-minutes">{totalMinutes} total minutes</div>
      {error && <div data-testid="session-error">{error}</div>}
      <ul data-testid="session-list">
        {sessions.map(s => (
          <li key={s.id} data-testid={`session-item-${s.id}`}>
            <span data-testid={`session-partner-${s.id}`}>{s.partnerName}</span>
            <span data-testid={`session-language-${s.id}`}>{s.language}</span>
            <span data-testid={`session-date-${s.id}`}>{s.date}</span>
            <span data-testid={`session-duration-${s.id}`}>{s.durationMinutes}min</span>
            <button data-testid={`btn-delete-session-${s.id}`} onClick={() => handleDelete(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div data-testid="add-session-form">
        <select data-testid="select-partner" value={partnerId} onChange={e => setPartnerId(e.target.value)}>
          <option value="">Select partner</option>
          {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select data-testid="select-session-language" value={language} onChange={e => setLanguage(e.target.value as Language)}>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <input data-testid="input-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input data-testid="input-duration" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (min)" />
        <input data-testid="input-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
        <button data-testid="btn-add-session" onClick={handleAdd}>Add Session</button>
      </div>
    </div>
  );
}
