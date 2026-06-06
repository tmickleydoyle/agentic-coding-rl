import React, { useState } from "react";
import { getMilestones, addMilestone, toggleMilestone } from "../../lib/store";
import { Milestone } from "../../lib/types";

export function MilestonesPage() {
  const [category, setCategory] = useState("all");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [cat, setCat] = useState<Milestone["category"]>("education");
  const [, forceUpdate] = useState(0);

  const milestones = getMilestones();
  const filtered = category === "all" ? milestones : milestones.filter((m) => m.category === category);

  const handleAdd = () => {
    if (!title.trim() || !targetDate) return;
    addMilestone({ title: title.trim(), description: description.trim(), targetDate, category: cat });
    setTitle(""); setDescription(""); setTargetDate("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="milestones-page">
      <h2>Milestones</h2>
      <select data-testid="category-filter" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All</option>
        <option value="education">Education</option>
        <option value="experience">Experience</option>
        <option value="skill">Skill</option>
        <option value="network">Network</option>
      </select>
      {filtered.map((m) => (
        <div key={m.id} data-testid="milestone-item">
          <span data-testid="milestone-title">{m.title}</span>
          <span data-testid="milestone-category">{m.category}</span>
          <span data-testid="milestone-date">{m.targetDate}</span>
          <input
            type="checkbox"
            data-testid="milestone-complete"
            checked={m.completed}
            onChange={() => { toggleMilestone(m.id); forceUpdate((n) => n + 1); }}
          />
        </div>
      ))}
      <div data-testid="add-milestone-form">
        <input data-testid="milestone-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input data-testid="milestone-desc-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input data-testid="milestone-date-input" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
        <select data-testid="milestone-cat-select" value={cat} onChange={(e) => setCat(e.target.value as Milestone["category"])}>
          <option value="education">Education</option>
          <option value="experience">Experience</option>
          <option value="skill">Skill</option>
          <option value="network">Network</option>
        </select>
        <button data-testid="add-milestone-btn" onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
}
