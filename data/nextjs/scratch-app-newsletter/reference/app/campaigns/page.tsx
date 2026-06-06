"use client";
import React, { useEffect, useState } from "react";
import { Campaign } from "../../lib/types";

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");

  const load = () => { fetch("/api/campaigns").then((r) => r.json()).then((d) => setCampaigns(d.campaigns ?? [])); };
  useEffect(() => { load(); }, []);

  const add = async () => {
    setError("");
    if (!subject.trim()) { setError("Subject required"); return; }
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, templateId: "", status: "draft", scheduledAt: "", sentCount: 0, openCount: 0, clickCount: 0 }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    setSubject(""); load();
  };

  const del = async (id: string) => {
    setError("");
    const res = await fetch(`/api/campaigns?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    load();
  };

  return (
    <div data-testid="campaigns-page">
      <h1>Campaigns</h1>
      {error && <div data-testid="campaigns-error">{error}</div>}
      <div data-testid="add-campaign-form">
        <input data-testid="campaign-subject" value={subject} placeholder="Subject" onChange={(e) => setSubject(e.target.value)} />
        <button data-testid="add-campaign-btn" onClick={add}>Add Campaign</button>
      </div>
      {campaigns.length === 0 ? (
        <div data-testid="no-campaigns">No campaigns yet</div>
      ) : (
        <ul data-testid="campaigns-list">
          {campaigns.map((c) => (
            <li key={c.id} data-testid={`campaign-${c.id}`}>
              <span data-testid={`campaign-subject-${c.id}`}>{c.subject}</span>
              <span data-testid={`campaign-status-${c.id}`}>{c.status}</span>
              <button data-testid={`delete-campaign-${c.id}`} onClick={() => del(c.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
