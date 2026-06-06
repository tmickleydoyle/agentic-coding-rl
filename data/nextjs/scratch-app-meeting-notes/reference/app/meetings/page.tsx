import React, { useState, useEffect } from "react";
import { Meeting } from "../../lib/types";

export function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [attendees, setAttendees] = useState("");
  const [notes, setNotes] = useState("");
  const [actionItems, setActionItems] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = () => fetch("/api/items").then((r) => r.json()).then((d) => setMeetings(d.meetings ?? []));
  useEffect(() => { load(); }, []);

  const reset = () => { setTitle(""); setDate(""); setAttendees(""); setNotes(""); setActionItems(""); setEditId(null); setError(""); };

  const submit = async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    const body = { title: title.trim(), date, attendees, notes, actionItems, agenda: [] };
    if (editId) {
      await fetch(`/api/items?id=${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    reset(); load();
  };

  const startEdit = (m: Meeting) => {
    setEditId(m.id); setTitle(m.title); setDate(m.date); setAttendees(m.attendees);
    setNotes(m.notes); setActionItems(m.actionItems);
  };

  const del = async (id: string) => { await fetch(`/api/items?id=${id}`, { method: "DELETE" }); load(); };

  return (
    <div data-testid="meetings-page">
      <h1>Meeting Notes</h1>
      {error && <p data-testid="form-error">{error}</p>}
      <div data-testid="meeting-form">
        <input data-testid="input-title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input data-testid="input-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="input-attendees" placeholder="Attendees (comma-separated)" value={attendees} onChange={(e) => setAttendees(e.target.value)} />
        <textarea data-testid="input-notes" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <textarea data-testid="input-action-items" placeholder="Action items" value={actionItems} onChange={(e) => setActionItems(e.target.value)} />
        <button data-testid="btn-submit" onClick={submit}>{editId ? "Update" : "Add Meeting"}</button>
        {editId && <button data-testid="btn-cancel" onClick={reset}>Cancel</button>}
      </div>
      <ul data-testid="meetings-list">
        {meetings.map((m) => (
          <li key={m.id} data-testid={`meeting-item-${m.id}`}>
            <span data-testid={`meeting-title-${m.id}`}>{m.title}</span>
            <span data-testid={`meeting-date-${m.id}`}>{m.date}</span>
            <button data-testid={`btn-edit-${m.id}`} onClick={() => startEdit(m)}>Edit</button>
            <button data-testid={`btn-delete-${m.id}`} onClick={() => del(m.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
