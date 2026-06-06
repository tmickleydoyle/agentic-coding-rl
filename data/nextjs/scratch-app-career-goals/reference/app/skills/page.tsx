import React, { useState } from "react";
import { getSkills, addSkill, updateSkillProficiency } from "../../lib/store";
import { CareerSkill } from "../../lib/types";

export function SkillsPage() {
  const [reqFilter, setReqFilter] = useState("all");
  const [name, setName] = useState("");
  const [proficiency, setProficiency] = useState<CareerSkill["proficiency"]>("beginner");
  const [required, setRequired] = useState(false);
  const [, forceUpdate] = useState(0);

  const skills = getSkills();
  const filtered = reqFilter === "all" ? skills : skills.filter((s) => reqFilter === "required" ? s.required : !s.required);

  const handleAdd = () => {
    if (!name.trim()) return;
    addSkill({ name: name.trim(), proficiency, required });
    setName("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="skills-page">
      <h2>Skills</h2>
      <select data-testid="required-filter" value={reqFilter} onChange={(e) => setReqFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="required">Required</option>
        <option value="optional">Optional</option>
      </select>
      {filtered.map((s) => (
        <div key={s.id} data-testid="skill-item">
          <span data-testid="skill-name">{s.name}</span>
          <span data-testid="skill-proficiency">{s.proficiency}</span>
          {s.required && <span data-testid="required-badge">Required</span>}
          <select
            data-testid="proficiency-select"
            value={s.proficiency}
            onChange={(e) => { updateSkillProficiency(s.id, e.target.value as CareerSkill["proficiency"]); forceUpdate((n) => n + 1); }}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      ))}
      <div data-testid="add-skill-form">
        <input data-testid="skill-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Skill name" />
        <select data-testid="skill-proficiency-select" value={proficiency} onChange={(e) => setProficiency(e.target.value as CareerSkill["proficiency"])}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <input type="checkbox" data-testid="skill-required-input" checked={required} onChange={(e) => setRequired(e.target.checked)} />
        <button data-testid="add-skill-btn" onClick={handleAdd}>Add Skill</button>
      </div>
    </div>
  );
}
