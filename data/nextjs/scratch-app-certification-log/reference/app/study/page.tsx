import React, { useState } from "react";
import { getStudyEntries, getCertifications, addStudyEntry } from "../../lib/store";

export function StudyPage() {
  const [certFilter, setCertFilter] = useState("all");
  const [certId, setCertId] = useState("");
  const [topic, setTopic] = useState("");
  const [hours, setHours] = useState("1");
  const [date, setDate] = useState("");
  const [, forceUpdate] = useState(0);

  const certs = getCertifications();
  const entries = getStudyEntries();
  const filtered = certFilter === "all" ? entries : entries.filter((e) => e.certId === certFilter);
  const certMap = new Map<string, string>();
  certs.forEach((c) => certMap.set(c.id, c.name));

  const totalHours = filtered.reduce((sum, e) => sum + e.hoursSpent, 0);

  const handleAdd = () => {
    if (!certId || !topic.trim() || !date) return;
    addStudyEntry({ certId, topic: topic.trim(), hoursSpent: parseFloat(hours), date });
    setTopic(""); setDate("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="study-page">
      <h2>Study Plan</h2>
      <select data-testid="cert-filter" value={certFilter} onChange={(e) => setCertFilter(e.target.value)}>
        <option value="all">All</option>
        {certs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <div data-testid="total-hours">{totalHours}</div>
      {filtered.map((e) => (
        <div key={e.id} data-testid="study-item">
          <span data-testid="study-topic">{e.topic}</span>
          <span data-testid="study-hours">{e.hoursSpent}</span>
          <span data-testid="study-date">{e.date}</span>
          <span data-testid="study-cert">{certMap.get(e.certId) ?? ""}</span>
        </div>
      ))}
      <div data-testid="add-study-form">
        <select data-testid="study-cert-select" value={certId} onChange={(e) => setCertId(e.target.value)}>
          <option value="">Select cert</option>
          {certs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input data-testid="study-topic-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" />
        <input data-testid="study-hours-input" type="number" value={hours} onChange={(e) => setHours(e.target.value)} />
        <input data-testid="study-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button data-testid="add-study-btn" onClick={handleAdd}>Add Entry</button>
      </div>
    </div>
  );
}
