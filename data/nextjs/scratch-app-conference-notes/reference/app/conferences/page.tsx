import React, { useState } from "react";
import { getConferences, addConference, deleteConference, toggleAttended } from "../../lib/store";

export function ConferencesPage() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [, forceUpdate] = useState(0);

  const conferences = getConferences();

  const handleAdd = () => {
    if (!name.trim() || !date || !location.trim()) return;
    addConference({ name: name.trim(), date, location: location.trim() });
    setName(""); setDate(""); setLocation("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="conferences-page">
      <h2>Conferences</h2>
      {conferences.map((c) => (
        <div key={c.id} data-testid="conference-item">
          <span data-testid="conf-name">{c.name}</span>
          <span data-testid="conf-date">{c.date}</span>
          <span data-testid="conf-location">{c.location}</span>
          {c.attended && <span data-testid="attended-badge">Attended</span>}
          <button data-testid="toggle-attended" onClick={() => { toggleAttended(c.id); forceUpdate((n) => n + 1); }}>
            {c.attended ? "Mark Not Attended" : "Mark Attended"}
          </button>
          <button data-testid="delete-conference" onClick={() => { deleteConference(c.id); forceUpdate((n) => n + 1); }}>Delete</button>
        </div>
      ))}
      <div data-testid="add-conference-form">
        <input data-testid="conf-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="conf-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="conf-location-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        <button data-testid="add-conference-btn" onClick={handleAdd}>Add Conference</button>
      </div>
    </div>
  );
}
