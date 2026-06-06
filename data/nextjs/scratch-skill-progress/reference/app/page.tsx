import React, { useState } from "react";

type Level = "Beginner" | "Intermediate" | "Advanced";

interface Skill {
  id: number;
  name: string;
  level: Level;
  hours: number;
}

const SEED: Skill[] = [
  { id: 1, name: "Knitting", level: "Beginner", hours: 12 },
  { id: 2, name: "Embroidery", level: "Intermediate", hours: 35 },
  { id: 3, name: "Weaving", level: "Beginner", hours: 5 },
  { id: 4, name: "Pottery", level: "Advanced", hours: 120 },
];

const NEXT_LEVEL: Record<string, Level> = {
  Beginner: "Intermediate",
  Intermediate: "Advanced",
};

export default function App() {
  const [skills, setSkills] = useState<Skill[]>(SEED);
  const [nextId, setNextId] = useState(5);
  const [filter, setFilter] = useState<"All" | Level>("All");

  const [inputName, setInputName] = useState("");
  const [inputLevel, setInputLevel] = useState<Level>("Beginner");
  const [inputHours, setInputHours] = useState("");

  const handleAdd = () => {
    if (!inputName.trim()) return;
    const hours = parseInt(inputHours, 10);
    if (isNaN(hours) || hours < 0) return;
    const newSkill: Skill = {
      id: nextId,
      name: inputName.trim(),
      level: inputLevel,
      hours,
    };
    setSkills((prev) => [...prev, newSkill]);
    setNextId((n) => n + 1);
    setInputName("");
    setInputLevel("Beginner");
    setInputHours("");
  };

  const handleAddHour = (id: number) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, hours: s.hours + 1 } : s))
    );
  };

  const handlePromote = (id: number) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const next = NEXT_LEVEL[s.level];
        return next ? { ...s, level: next } : s;
      })
    );
  };

  const handleDelete = (id: number) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const displayed =
    filter === "All" ? skills : skills.filter((s) => s.level === filter);

  const totalHours = skills.reduce((sum, s) => sum + s.hours, 0);

  return (
    <div>
      <h1>Craft Skill Tracker</h1>

      <div>
        <label htmlFor="input-name">Skill Name</label>
        <input
          id="input-name"
          data-testid="input-name"
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
        />
        <label htmlFor="select-level">Level</label>
        <select
          id="select-level"
          data-testid="select-level"
          value={inputLevel}
          onChange={(e) => setInputLevel(e.target.value as Level)}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <label htmlFor="input-hours">Hours</label>
        <input
          id="input-hours"
          data-testid="input-hours"
          type="number"
          value={inputHours}
          onChange={(e) => setInputHours(e.target.value)}
        />
        <button data-testid="btn-add" onClick={handleAdd}>
          Add Skill
        </button>
      </div>

      <div>
        <button data-testid="filter-all" onClick={() => setFilter("All")}>All</button>
        <button data-testid="filter-beginner" onClick={() => setFilter("Beginner")}>Beginner</button>
        <button data-testid="filter-intermediate" onClick={() => setFilter("Intermediate")}>Intermediate</button>
        <button data-testid="filter-advanced" onClick={() => setFilter("Advanced")}>Advanced</button>
      </div>

      <div data-testid="total-hours">Total: {totalHours} hrs</div>

      {displayed.length === 0 ? (
        <div data-testid="empty-msg">No skills found</div>
      ) : (
        <div>
          {displayed.map((s) => (
            <div key={s.id} data-testid={`skill-${s.id}`}>
              <span data-testid={`skill-name-${s.id}`}>{s.name}</span>
              <span data-testid={`skill-level-${s.id}`}>{s.level}</span>
              <span data-testid={`skill-hours-${s.id}`}>{s.hours} hrs</span>
              <button
                data-testid={`btn-hour-${s.id}`}
                onClick={() => handleAddHour(s.id)}
              >
                +1 Hour
              </button>
              {s.level !== "Advanced" && (
                <button
                  data-testid={`btn-promote-${s.id}`}
                  onClick={() => handlePromote(s.id)}
                >
                  Promote
                </button>
              )}
              <button
                data-testid={`btn-delete-${s.id}`}
                onClick={() => handleDelete(s.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
