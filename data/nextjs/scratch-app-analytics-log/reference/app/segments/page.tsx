"use client";
import React, { useEffect, useState } from "react";
import { Segment } from "../../lib/types";

export function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [segCounts, setSegCounts] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [eventName, setEventName] = useState("");
  const [minOcc, setMinOcc] = useState("1");

  const load = () => {
    fetch("/api/events/segments").then((r) => r.json()).then((d) => {
      const segs: Segment[] = d.segments ?? [];
      setSegments(segs);
      segs.forEach((s) => {
        fetch(`/api/events/segments/${s.id}/count`).then((r) => r.json()).then((c) => {
          setSegCounts((prev) => ({ ...prev, [s.id]: c.count ?? 0 }));
        });
      });
    });
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    await fetch("/api/events/segments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, eventName, minOccurrences: parseInt(minOcc) || 1 }),
    });
    setName(""); setEventName(""); setMinOcc("1"); load();
  };

  return (
    <div data-testid="segments-page">
      <h1>Segments</h1>
      <div data-testid="add-segment-form">
        <input data-testid="segment-name" value={name} placeholder="Segment name" onChange={(e) => setName(e.target.value)} />
        <input data-testid="segment-event" value={eventName} placeholder="Event name" onChange={(e) => setEventName(e.target.value)} />
        <input data-testid="segment-min-occ" type="number" value={minOcc} onChange={(e) => setMinOcc(e.target.value)} />
        <button data-testid="add-segment-btn" onClick={add}>Add Segment</button>
      </div>
      <ul data-testid="segments-list">
        {segments.map((s) => (
          <li key={s.id} data-testid={`segment-${s.id}`}>
            <span data-testid={`segment-name-${s.id}`}>{s.name}</span>
            <span data-testid={`segment-count-${s.id}`}>{segCounts[s.id] ?? 0}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
