import React, { useState, useMemo } from "react";

type Proficiency = "beginner" | "intermediate" | "expert";

interface TechEntry {
  id: number;
  name: string;
  category: string;
  tags: string[];
  description: string;
  proficiency: Proficiency;
}

const SEED_DATA: TechEntry[] = [
  { id: 1, name: "TypeScript", category: "Language", tags: ["frontend", "backend"], description: "Typed superset of JavaScript", proficiency: "expert" },
  { id: 2, name: "React", category: "Frontend", tags: ["frontend", "ui"], description: "UI component library", proficiency: "expert" },
  { id: 3, name: "PostgreSQL", category: "Database", tags: ["backend", "database"], description: "Relational database", proficiency: "intermediate" },
  { id: 4, name: "Docker", category: "DevOps", tags: ["backend", "devops"], description: "Container platform", proficiency: "intermediate" },
  { id: 5, name: "Tailwind CSS", category: "Frontend", tags: ["frontend", "ui"], description: "Utility-first CSS framework", proficiency: "expert" },
  { id: 6, name: "Python", category: "Language", tags: ["backend", "scripting"], description: "General purpose language", proficiency: "intermediate" },
];

export default function App() {
  const [techs, setTechs] = useState<TechEntry[]>(SEED_DATA);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterProficiency, setFilterProficiency] = useState("All");
  const [searchTag, setSearchTag] = useState("");
  const [nextId, setNextId] = useState(7);

  const [inputName, setInputName] = useState("");
  const [inputCategory, setInputCategory] = useState("");
  const [inputTags, setInputTags] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [inputProficiency, setInputProficiency] = useState<Proficiency>("beginner");

  const totalCount = techs.length;
  const expertCount = techs.filter((t) => t.proficiency === "expert").length;
  const intermediateCount = techs.filter((t) => t.proficiency === "intermediate").length;
  const beginnerCount = techs.filter((t) => t.proficiency === "beginner").length;

  const categories = useMemo(() => {
    const cats = Array.from(new Set(techs.map((t) => t.category)));
    cats.sort();
    return cats;
  }, [techs]);

  const displayed = useMemo(() => {
    return techs.filter((t) => {
      if (filterCategory !== "All" && t.category !== filterCategory) return false;
      if (filterProficiency !== "All" && t.proficiency !== filterProficiency) return false;
      if (searchTag.trim() !== "") {
        const lower = searchTag.trim().toLowerCase();
        if (!t.tags.some((tag) => tag.toLowerCase().includes(lower))) return false;
      }
      return true;
    });
  }, [techs, filterCategory, filterProficiency, searchTag]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!inputName.trim()) return;
    const tags = inputTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const newTech: TechEntry = {
      id: nextId,
      name: inputName.trim(),
      category: inputCategory.trim(),
      tags,
      description: inputDescription.trim(),
      proficiency: inputProficiency,
    };
    setTechs((prev) => [...prev, newTech]);
    setNextId((n) => n + 1);
    setInputName("");
    setInputCategory("");
    setInputTags("");
    setInputDescription("");
    setInputProficiency("beginner");
  }

  function handleRemove(id: number) {
    setTechs((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div>
      <h1>My Tech Stack</h1>

      <div>
        <span data-testid="total-count">{totalCount}</span>
        <span data-testid="expert-count">{expertCount}</span>
        <span data-testid="intermediate-count">{intermediateCount}</span>
        <span data-testid="beginner-count">{beginnerCount}</span>
      </div>

      <div>
        <label>
          Category
          <select
            data-testid="filter-category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Proficiency
          <select
            data-testid="filter-proficiency"
            value={filterProficiency}
            onChange={(e) => setFilterProficiency(e.target.value)}
          >
            <option value="All">All</option>
            <option value="beginner">beginner</option>
            <option value="intermediate">intermediate</option>
            <option value="expert">expert</option>
          </select>
        </label>

        <label>
          Search Tag
          <input
            data-testid="search-tag"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
          />
        </label>
      </div>

      <div>
        {displayed.length === 0 ? (
          <div data-testid="empty-message">No technologies found.</div>
        ) : (
          displayed.map((t) => (
            <div key={t.id} data-testid="tech-item">
              <span data-testid="tech-name">{t.name}</span>
              <span data-testid="tech-category">{t.category}</span>
              <span data-testid="tech-tags">{t.tags.join(", ")}</span>
              <span data-testid="tech-description">{t.description}</span>
              <span data-testid="tech-proficiency">{t.proficiency}</span>
              <button data-testid="remove-tech-btn" onClick={() => handleRemove(t.id)}>
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAdd}>
        <label>
          Name
          <input
            data-testid="input-name"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
        </label>
        <label>
          Category
          <input
            data-testid="input-category"
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value)}
          />
        </label>
        <label>
          Tags (comma-separated)
          <input
            data-testid="input-tags"
            value={inputTags}
            onChange={(e) => setInputTags(e.target.value)}
          />
        </label>
        <label>
          Description
          <textarea
            data-testid="input-description"
            value={inputDescription}
            onChange={(e) => setInputDescription(e.target.value)}
          />
        </label>
        <label>
          Proficiency
          <select
            data-testid="input-proficiency"
            value={inputProficiency}
            onChange={(e) => setInputProficiency(e.target.value as Proficiency)}
          >
            <option value="beginner">beginner</option>
            <option value="intermediate">intermediate</option>
            <option value="expert">expert</option>
          </select>
        </label>
        <button type="submit">Add Technology</button>
      </form>
    </div>
  );
}
