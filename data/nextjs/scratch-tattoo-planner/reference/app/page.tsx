import React, { useState } from "react";

const STYLES = ["Traditional", "Neo-traditional", "Fine line", "Watercolor", "Blackwork", "Realism"];

interface TattooIdea {
  id: number;
  name: string;
  style: string;
  placement: string;
  done: boolean;
}

const SEED_IDEAS: TattooIdea[] = [
  { id: 1, name: "Geometric wolf", style: "Neo-traditional", placement: "Upper arm", done: false },
  { id: 2, name: "Minimalist sun", style: "Fine line", placement: "Wrist", done: false },
  { id: 3, name: "Floral sleeve", style: "Watercolor", placement: "Full sleeve", done: false },
  { id: 4, name: "Anchor with rope", style: "Traditional", placement: "Calf", done: true },
];

export default function App() {
  const [ideas, setIdeas] = useState<TattooIdea[]>(SEED_IDEAS);
  const [name, setName] = useState("");
  const [style, setStyle] = useState(STYLES[0]);
  const [placement, setPlacement] = useState("");
  const [filterStyle, setFilterStyle] = useState("All");
  const [nextId, setNextId] = useState(5);

  const handleAdd = () => {
    if (!name.trim() || !placement.trim()) return;
    const newIdea: TattooIdea = {
      id: nextId,
      name: name.trim(),
      style,
      placement: placement.trim(),
      done: false,
    };
    setIdeas([...ideas, newIdea]);
    setNextId(nextId + 1);
    setName("");
    setPlacement("");
  };

  const toggleDone = (id: number) => {
    setIdeas(ideas.map((idea) => (idea.id === id ? { ...idea, done: !idea.done } : idea)));
  };

  const deleteIdea = (id: number) => {
    setIdeas(ideas.filter((idea) => idea.id !== id));
  };

  const visible = filterStyle === "All" ? ideas : ideas.filter((i) => i.style === filterStyle);
  const completedCount = visible.filter((i) => i.done).length;

  return (
    <div>
      <h1>Tattoo Planner</h1>

      <div data-testid="add-form">
        <input
          data-testid="name-input"
          placeholder="Tattoo name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          data-testid="style-select"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        >
          {STYLES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          data-testid="placement-input"
          placeholder="Placement"
          value={placement}
          onChange={(e) => setPlacement(e.target.value)}
        />
        <button data-testid="add-button" onClick={handleAdd}>
          Add Idea
        </button>
      </div>

      <div data-testid="filter-section">
        <select
          data-testid="filter-select"
          value={filterStyle}
          onChange={(e) => setFilterStyle(e.target.value)}
        >
          <option value="All">All</option>
          {STYLES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div data-testid="completion-count">
        {completedCount} / {visible.length} completed
      </div>

      <div data-testid="ideas-list">
        {visible.map((idea) => (
          <div key={idea.id} data-testid="idea-card">
            <span data-testid="idea-name">{idea.name}</span>
            <span data-testid="idea-style">{idea.style}</span>
            <span data-testid="idea-placement">{idea.placement}</span>
            {idea.done && <span data-testid="idea-done">Done</span>}
            <button
              data-testid="toggle-done-button"
              onClick={() => toggleDone(idea.id)}
            >
              {idea.done ? "Undo" : "Mark Done"}
            </button>
            <button
              data-testid="delete-button"
              onClick={() => deleteIdea(idea.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
