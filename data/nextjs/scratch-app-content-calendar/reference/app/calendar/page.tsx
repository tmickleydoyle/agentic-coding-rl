"use client";
import React, { useEffect, useState } from "react";
import { ContentItem } from "../../lib/types";

export function CalendarPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [title, setTitle] = useState("");
  const [channel, setChannel] = useState<string>("blog");
  const [scheduledDate, setScheduledDate] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/content").then((r) => r.json()).then((d) => setItems(d.items ?? []));
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    setError("");
    if (!title.trim() || !scheduledDate) { setError("Title and date required"); return; }
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body: "", channel, status: "draft", scheduledDate }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    setTitle(""); setScheduledDate("");
    load();
  };

  // Group by date
  const byDate: Record<string, ContentItem[]> = {};
  items.forEach((i) => {
    if (!byDate[i.scheduledDate]) byDate[i.scheduledDate] = [];
    byDate[i.scheduledDate].push(i);
  });
  const dates = Object.keys(byDate).sort();

  return (
    <div data-testid="calendar-page">
      <h1>Content Calendar</h1>
      {error && <div data-testid="calendar-error">{error}</div>}
      <div data-testid="add-content-form">
        <input data-testid="content-title" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        <select data-testid="content-channel" value={channel} onChange={(e) => setChannel(e.target.value)}>
          <option value="blog">Blog</option>
          <option value="twitter">Twitter</option>
          <option value="linkedin">LinkedIn</option>
          <option value="email">Email</option>
        </select>
        <input data-testid="content-date" type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
        <button data-testid="add-content-btn" onClick={add}>Add</button>
      </div>
      <div data-testid="calendar-grid">
        {dates.map((d) => (
          <div key={d} data-testid={`date-group-${d}`}>
            <strong>{d}</strong>
            <ul>
              {byDate[d].map((i) => (
                <li key={i.id} data-testid={`cal-item-${i.id}`}>
                  <span data-testid={`cal-title-${i.id}`}>{i.title}</span>
                  <span data-testid={`cal-channel-${i.id}`}>{i.channel}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
