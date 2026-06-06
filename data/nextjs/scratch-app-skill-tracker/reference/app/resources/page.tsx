import React, { useState } from "react";
import { getResources, getSkills, addResource, toggleResource } from "../../lib/store";
import { Resource } from "../../lib/types";

export function ResourcesPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [skillId, setSkillId] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<Resource["type"]>("article");
  const [, forceUpdate] = useState(0);

  const skills = getSkills();
  const resources = getResources();
  const filtered = typeFilter === "all" ? resources : resources.filter((r) => r.type === typeFilter);
  const skillMap = new Map<string, string>();
  skills.forEach((s) => skillMap.set(s.id, s.name));

  const handleAdd = () => {
    if (!skillId || !title.trim() || !url.trim()) return;
    addResource({ skillId, title: title.trim(), url: url.trim(), type });
    setTitle(""); setUrl("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="resources-page">
      <h2>Resources</h2>
      <select data-testid="type-filter" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="article">Article</option>
        <option value="video">Video</option>
        <option value="course">Course</option>
        <option value="book">Book</option>
      </select>
      {filtered.map((r) => (
        <div key={r.id} data-testid="resource-item">
          <span data-testid="resource-title">{r.title}</span>
          <span data-testid="resource-type">{r.type}</span>
          <span data-testid="resource-skill">{skillMap.get(r.skillId) ?? ""}</span>
          <input
            type="checkbox"
            data-testid="resource-complete"
            checked={r.completed}
            onChange={() => { toggleResource(r.id); forceUpdate((n) => n + 1); }}
          />
        </div>
      ))}
      <div data-testid="add-resource-form">
        <select data-testid="resource-skill-select" value={skillId} onChange={(e) => setSkillId(e.target.value)}>
          <option value="">Select skill</option>
          {skills.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input data-testid="resource-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input data-testid="resource-url-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
        <select data-testid="resource-type-select" value={type} onChange={(e) => setType(e.target.value as Resource["type"])}>
          <option value="article">Article</option>
          <option value="video">Video</option>
          <option value="course">Course</option>
          <option value="book">Book</option>
        </select>
        <button data-testid="add-resource-btn" onClick={handleAdd}>Add Resource</button>
      </div>
    </div>
  );
}
