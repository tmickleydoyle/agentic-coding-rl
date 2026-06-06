import React, { useState, useEffect } from "react";
import { Meeting, AgendaItem } from "../../lib/types";

export function AgendaPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState("");

  const load = () => fetch("/api/items").then((r) => r.json()).then((d) => setMeetings(d.meetings ?? []));
  useEffect(() => { load(); }, []);

  const selected = meetings.find((m) => m.id === selectedId);

  const addItem = async () => {
    if (!newItem.trim() || !selectedId) return;
    const agenda: AgendaItem[] = [...(selected?.agenda ?? []), { id: String(Date.now()), text: newItem.trim(), done: false }];
    await fetch(`/api/items?id=${selectedId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agenda }) });
    setNewItem(""); load();
  };

  const toggleItem = async (itemId: string) => {
    if (!selected) return;
    const agenda = selected.agenda.map((a) => a.id === itemId ? { ...a, done: !a.done } : a);
    await fetch(`/api/items?id=${selectedId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agenda }) });
    load();
  };

  return (
    <div data-testid="agenda-page">
      <h1>Meeting Agenda</h1>
      <select data-testid="select-meeting" value={selectedId ?? ""} onChange={(e) => setSelectedId(e.target.value || null)}>
        <option value="">Select a meeting</option>
        {meetings.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
      </select>
      {selected && (
        <div data-testid="agenda-editor">
          <h2 data-testid="agenda-meeting-title">{selected.title}</h2>
          <ul data-testid="agenda-items">
            {selected.agenda.map((a) => (
              <li key={a.id} data-testid={`agenda-item-${a.id}`}>
                <input type="checkbox" data-testid={`agenda-check-${a.id}`} checked={a.done} onChange={() => toggleItem(a.id)} />
                <span data-testid={`agenda-text-${a.id}`} style={{ textDecoration: a.done ? "line-through" : "none" }}>{a.text}</span>
              </li>
            ))}
          </ul>
          <input data-testid="input-agenda-item" placeholder="New agenda item" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
          <button data-testid="btn-add-agenda-item" onClick={addItem}>Add Item</button>
        </div>
      )}
    </div>
  );
}
