"use client";
import React, { useEffect, useState } from "react";
import { Subscriber } from "../../lib/types";

export function SubscribersPage() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const load = () => { fetch("/api/subscribers").then((r) => r.json()).then((d) => setSubs(d.subscribers ?? [])); };
  useEffect(() => { load(); }, []);

  const add = async () => {
    setError("");
    const res = await fetch("/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, tags: [], active: true }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    setEmail(""); setName(""); load();
  };

  const deactivate = async (id: string) => {
    await fetch(`/api/subscribers?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div data-testid="subscribers-page">
      <h1>Subscribers</h1>
      {error && <div data-testid="subscribers-error">{error}</div>}
      <div data-testid="add-subscriber-form">
        <input data-testid="subscriber-email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input data-testid="subscriber-name" value={name} placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <button data-testid="add-subscriber-btn" onClick={add}>Add Subscriber</button>
      </div>
      {subs.length === 0 ? (
        <div data-testid="no-subscribers">No subscribers</div>
      ) : (
        <ul data-testid="subscribers-list">
          {subs.map((s) => (
            <li key={s.id} data-testid={`subscriber-${s.id}`}>
              <span data-testid={`subscriber-email-${s.id}`}>{s.email}</span>
              <span data-testid={`subscriber-active-${s.id}`}>{s.active ? "active" : "inactive"}</span>
              <button data-testid={`deactivate-${s.id}`} onClick={() => deactivate(s.id)}>Deactivate</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
