import React, { useState } from "react";
import { getEntries, getSkills, addEntry } from "../../lib/store";

export function ProgressPage() {
  const [skillFilter, setSkillFilter] = useState("all");
  const [skillId, setSkillId] = useState("");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("1");
  const [notes, setNotes] = useState("");
  const [, forceUpdate] = useState(0);

  const skills = getSkills();
  const entries = getEntries();
  const filtered = skillFilter === "all" ? entries : entries.filter((e) => e.skillId === skillFilter);
  const skillMap = new Map<string, string>();
  skills.forEach((s) => skillMap.set(s.id, s.name));

  const handleAdd = () => {
    if (!skillId || !date) return;
    addEntry({ skillId, date, hoursLogged: parseFloat(hours), notes: notes.trim() });
    setDate(""); setNotes("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="progress-page">
      <h2>Progress</h2>
      <select data-testid="skill-filter" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
        <option value="all">All</option>
        {skills.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      {filtered.map((e) => (
        <div key={e.id} data-testid="progress-item">
          <span data-testid="progress-date">{e.date}</span>
          <span data-testid="progress-hours">{e.hoursLogged}</span>
          <span data-testid="progress-notes">{e.notes}</span>
          <span data-testid="progress-skill">{skillMap.get(e.skillId) ?? ""}</span>
        </div>
      ))}
      <div data-testid="add-progress-form">
        <select data-testid="progress-skill-select" value={skillId} onChange={(e) => setSkillId(e.target.value)}>
          <option value="">Select skill</option>
          {skills.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input data-testid="progress-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="progress-hours-input" type="number" value={hours} onChange={(e) => setHours(e.target.value)} />
        <textarea data-testid="progress-notes-input" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button data-testid="add-progress-btn" onClick={handleAdd}>Log Progress</button>
      </div>
    </div>
  );
}
