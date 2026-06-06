"use client";
import React, { useEffect, useState } from "react";
import { EventLog } from "../../lib/types";

export function EventsPage() {
  const [events, setEvents] = useState<EventLog[]>([]);
  const [filterName, setFilterName] = useState("");
  const [name, setName] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    const q = filterName ? `?name=${encodeURIComponent(filterName)}` : "";
    fetch(`/api/events${q}`).then((r) => r.json()).then((d) => setEvents(d.events ?? []));
  };
  useEffect(() => { load(); }, [filterName]);

  const add = async () => {
    setError("");
    if (!name.trim() || !sessionId.trim()) { setError("Name and sessionId required"); return; }
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, sessionId, properties: {}, timestamp: new Date().toISOString() }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    setName(""); setSessionId(""); load();
  };

  return (
    <div data-testid="events-page">
      <h1>Events</h1>
      {error && <div data-testid="events-error">{error}</div>}
      <div data-testid="add-event-form">
        <input data-testid="event-name" value={name} placeholder="Event name" onChange={(e) => setName(e.target.value)} />
        <input data-testid="event-session" value={sessionId} placeholder="Session ID" onChange={(e) => setSessionId(e.target.value)} />
        <button data-testid="add-event-btn" onClick={add}>Add Event</button>
      </div>
      <input data-testid="filter-name" value={filterName} placeholder="Filter by name" onChange={(e) => setFilterName(e.target.value)} />
      {events.length === 0 ? (
        <div data-testid="no-events">No events logged</div>
      ) : (
        <ul data-testid="events-list">
          {events.map((e) => (
            <li key={e.id} data-testid={`event-${e.id}`}>
              <span data-testid={`event-name-${e.id}`}>{e.name}</span>
              <span data-testid={`event-session-${e.id}`}>{e.sessionId}</span>
              <span data-testid={`event-time-${e.id}`}>{e.timestamp}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
