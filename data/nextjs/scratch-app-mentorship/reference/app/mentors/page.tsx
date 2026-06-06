import React, { useState } from "react";
import { getMentors, addMentor, deleteMentor, toggleMentorActive } from "../../lib/store";

export function MentorsPage() {
  const [specialty, setSpecialty] = useState("all");
  const [name, setName] = useState("");
  const [spec, setSpec] = useState("");
  const [email, setEmail] = useState("");
  const [, forceUpdate] = useState(0);

  const mentors = getMentors();
  const specialties = Array.from(new Set(mentors.map((m) => m.specialty)));
  const filtered = specialty === "all" ? mentors : mentors.filter((m) => m.specialty === specialty);

  const handleAdd = () => {
    if (!name.trim() || !spec.trim() || !email.trim()) return;
    addMentor({ name: name.trim(), specialty: spec.trim(), email: email.trim() });
    setName(""); setSpec(""); setEmail("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="mentors-page">
      <h2>Mentors</h2>
      <select data-testid="specialty-filter" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
        <option value="all">All</option>
        {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      {filtered.map((m) => (
        <div key={m.id} data-testid="mentor-item">
          <span data-testid="mentor-name">{m.name}</span>
          <span data-testid="mentor-specialty">{m.specialty}</span>
          <span data-testid="mentor-email">{m.email}</span>
          {m.active && <span data-testid="active-badge">Active</span>}
          <button data-testid="toggle-active" onClick={() => { toggleMentorActive(m.id); forceUpdate((n) => n + 1); }}>
            {m.active ? "Deactivate" : "Activate"}
          </button>
          <button data-testid="delete-mentor" onClick={() => { deleteMentor(m.id); forceUpdate((n) => n + 1); }}>Delete</button>
        </div>
      ))}
      <div data-testid="add-mentor-form">
        <input data-testid="mentor-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="mentor-specialty-input" value={spec} onChange={(e) => setSpec(e.target.value)} placeholder="Specialty" />
        <input data-testid="mentor-email-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button data-testid="add-mentor-btn" onClick={handleAdd}>Add Mentor</button>
      </div>
    </div>
  );
}
