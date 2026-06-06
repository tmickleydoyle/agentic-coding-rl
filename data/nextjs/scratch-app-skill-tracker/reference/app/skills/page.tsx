import React, { useState } from "react";
import { getSkills, addSkill, updateSkillLevel } from "../../lib/store";
import { Skill } from "../../lib/types";

export function SkillsPage() {
  const [catFilter, setCatFilter] = useState("all");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState<Skill["level"]>("beginner");
  const [, forceUpdate] = useState(0);

  const skills = getSkills();
  const categories = Array.from(new Set(skills.map((s) => s.category)));
  const filtered = catFilter === "all" ? skills : skills.filter((s) => s.category === catFilter);

  const handleAdd = () => {
    if (!name.trim() || !category.trim()) return;
    addSkill({ name: name.trim(), category: category.trim(), level });
    setName(""); setCategory("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="skills-page">
      <h2>Skills</h2>
      <select data-testid="category-filter" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
        <option value="all">All</option>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      {filtered.map((s) => (
        <div key={s.id} data-testid="skill-item">
          <span data-testid="skill-name">{s.name}</span>
          <span data-testid="skill-category">{s.category}</span>
          <span data-testid="skill-level">{s.level}</span>
          <span data-testid="skill-hours">{s.hoursTotal}</span>
          <select
            data-testid="level-select"
            value={s.level}
            onChange={(e) => { updateSkillLevel(s.id, e.target.value as Skill["level"]); forceUpdate((n) => n + 1); }}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      ))}
      <div data-testid="add-skill-form">
        <input data-testid="skill-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="skill-category-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
        <select data-testid="skill-level-select" value={level} onChange={(e) => setLevel(e.target.value as Skill["level"])}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <button data-testid="add-skill-btn" onClick={handleAdd}>Add Skill</button>
      </div>
    </div>
  );
}
