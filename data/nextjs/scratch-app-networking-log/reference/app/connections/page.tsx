import React, { useState } from "react";
import { getConnections, getEvents, addConnection } from "../../lib/store";

export function ConnectionsPage() {
  const [filter, setFilter] = useState("all");
  const [eventId, setEventId] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [, forceUpdate] = useState(0);

  const events = getEvents();
  const connections = getConnections();
  const filtered = filter === "all" ? connections : connections.filter((c) => c.eventId === filter);

  const handleAdd = () => {
    if (!eventId || !name.trim()) return;
    addConnection({ eventId, name: name.trim(), role: role.trim(), company: company.trim(), email: email.trim() });
    setName(""); setRole(""); setCompany(""); setEmail("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="connections-page">
      <h2>Connections</h2>
      <select data-testid="event-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        {events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
      </select>
      {filtered.map((c) => (
        <div key={c.id} data-testid="connection-item">
          <span data-testid="connection-name">{c.name}</span>
          <span data-testid="connection-role">{c.role}</span>
          <span data-testid="connection-company">{c.company}</span>
        </div>
      ))}
      <div data-testid="add-connection-form">
        <select data-testid="connection-event-select" value={eventId} onChange={(e) => setEventId(e.target.value)}>
          <option value="">Select event</option>
          {events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <input data-testid="connection-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="connection-role-input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
        <input data-testid="connection-company-input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" />
        <input data-testid="connection-email-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button data-testid="add-connection-btn" onClick={handleAdd}>Add Connection</button>
      </div>
    </div>
  );
}
