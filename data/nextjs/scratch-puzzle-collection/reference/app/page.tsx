import React, { useState } from "react";

type Category = "Logic" | "Spatial" | "Numbers" | "Words";

interface Puzzle {
  id: number;
  title: string;
  category: Category;
  difficulty: number;
  solved: boolean;
  notes: string;
}

const SEED_PUZZLES: Puzzle[] = [
  { id: 1, title: "Towers of Hanoi", category: "Logic", difficulty: 3, solved: true, notes: "Move all discs to target peg" },
  { id: 2, title: "Rubik's Cube", category: "Spatial", difficulty: 5, solved: false, notes: "Solve all six faces" },
  { id: 3, title: "Sudoku Master", category: "Numbers", difficulty: 4, solved: true, notes: "9x9 grid variant" },
  { id: 4, title: "Cryptic Crossword", category: "Words", difficulty: 4, solved: false, notes: "" },
];

const CATEGORIES: Category[] = ["Logic", "Spatial", "Numbers", "Words"];

let nextId = 5;

export default function App() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>(SEED_PUZZLES);
  const [filter, setFilter] = useState<string>("All");
  const [titleInput, setTitleInput] = useState("");
  const [categoryInput, setCategoryInput] = useState<Category>("Logic");
  const [difficultyInput, setDifficultyInput] = useState("");
  const [notesInput, setNotesInput] = useState("");

  const totalPuzzles = puzzles.length;
  const solvedCount = puzzles.filter((p) => p.solved).length;
  const unsolvedCount = totalPuzzles - solvedCount;

  const visiblePuzzles = filter === "All" ? puzzles : puzzles.filter((p) => p.category === filter);

  function handleAdd() {
    const trimTitle = titleInput.trim();
    const diff = parseInt(difficultyInput, 10);
    if (!trimTitle || isNaN(diff) || diff < 1 || diff > 5) return;
    const newPuzzle: Puzzle = {
      id: nextId++,
      title: trimTitle,
      category: categoryInput,
      difficulty: diff,
      solved: false,
      notes: notesInput.trim(),
    };
    setPuzzles((prev) => [...prev, newPuzzle]);
    setTitleInput("");
    setCategoryInput("Logic");
    setDifficultyInput("");
    setNotesInput("");
  }

  function handleToggle(id: number) {
    setPuzzles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, solved: !p.solved } : p))
    );
  }

  function handleRemove(id: number) {
    setPuzzles((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <h1>Puzzle Collection</h1>

      <div>
        <span data-testid="total-puzzles">{totalPuzzles}</span>
        <span data-testid="solved-count">{solvedCount}</span>
        <span data-testid="unsolved-count">{unsolvedCount}</span>
      </div>

      <div>
        <select
          data-testid="category-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <input
          data-testid="title-input"
          type="text"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          placeholder="Puzzle title"
        />
        <select
          data-testid="category-input"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value as Category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          data-testid="difficulty-input"
          type="number"
          value={difficultyInput}
          onChange={(e) => setDifficultyInput(e.target.value)}
          min={1}
          max={5}
          placeholder="Difficulty (1-5)"
        />
        <textarea
          data-testid="notes-input"
          value={notesInput}
          onChange={(e) => setNotesInput(e.target.value)}
          placeholder="Notes"
        />
        <button data-testid="add-puzzle-btn" onClick={handleAdd}>
          Add Puzzle
        </button>
      </div>

      <div>
        {visiblePuzzles.map((puzzle) => (
          <div key={puzzle.id} data-testid={`puzzle-card-${puzzle.id}`}>
            <span data-testid={`puzzle-title-${puzzle.id}`}>{puzzle.title}</span>
            <span data-testid={`puzzle-category-${puzzle.id}`}>{puzzle.category}</span>
            <span data-testid={`puzzle-difficulty-${puzzle.id}`}>{puzzle.difficulty}/5</span>
            <span data-testid={`puzzle-status-${puzzle.id}`}>
              {puzzle.solved ? "Solved" : "Unsolved"}
            </span>
            <span data-testid={`puzzle-notes-${puzzle.id}`}>{puzzle.notes}</span>
            <button
              data-testid={`toggle-solved-${puzzle.id}`}
              onClick={() => handleToggle(puzzle.id)}
            >
              {puzzle.solved ? "Mark Unsolved" : "Mark Solved"}
            </button>
            <button
              data-testid={`remove-puzzle-${puzzle.id}`}
              onClick={() => handleRemove(puzzle.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
