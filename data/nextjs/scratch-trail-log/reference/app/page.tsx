import { useState } from "react";

type Difficulty = "Easy" | "Moderate" | "Hard";

interface Trail {
  id: number;
  name: string;
  distance: number;
  difficulty: Difficulty;
  date: string;
  rating: number;
}

const SEED_TRAILS: Trail[] = [
  { id: 1, name: "Eagle Peak", distance: 6.2, difficulty: "Hard", date: "2024-03-15", rating: 5 },
  { id: 2, name: "River Loop", distance: 3.1, difficulty: "Easy", date: "2024-04-02", rating: 4 },
  { id: 3, name: "Summit Trail", distance: 9.8, difficulty: "Hard", date: "2024-04-20", rating: 4 },
  { id: 4, name: "Meadow Walk", distance: 1.5, difficulty: "Easy", date: "2024-05-01", rating: 3 },
  { id: 5, name: "Ridge Line", distance: 5.0, difficulty: "Moderate", date: "2024-05-18", rating: 5 },
];

const DIFFICULTIES: Difficulty[] = ["Easy", "Moderate", "Hard"];

function Stars({ rating }: { rating: number }) {
  const filled = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return <span data-testid="stars">{filled}{empty}</span>;
}

export default function App() {
  const [trails, setTrails] = useState<Trail[]>(SEED_TRAILS);
  const [filter, setFilter] = useState<"All" | Difficulty>("All");
  const [nextId, setNextId] = useState(6);

  const [formName, setFormName] = useState("");
  const [formDistance, setFormDistance] = useState("");
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>("Easy");
  const [formDate, setFormDate] = useState("");
  const [formRating, setFormRating] = useState("3");

  const filtered = filter === "All" ? trails : trails.filter((t) => t.difficulty === filter);

  const totalMiles = filtered.reduce((sum, t) => sum + t.distance, 0);
  const avgRating = filtered.length > 0
    ? (filtered.reduce((sum, t) => sum + t.rating, 0) / filtered.length).toFixed(1)
    : "—";

  const addTrail = () => {
    if (!formName.trim() || !formDistance || parseFloat(formDistance) <= 0) return;
    const newTrail: Trail = {
      id: nextId,
      name: formName.trim(),
      distance: parseFloat(formDistance),
      difficulty: formDifficulty,
      date: formDate,
      rating: parseInt(formRating, 10),
    };
    setTrails([...trails, newTrail]);
    setNextId(nextId + 1);
    setFormName("");
    setFormDistance("");
    setFormDate("");
    setFormRating("3");
  };

  const deleteTrail = (id: number) => {
    setTrails(trails.filter((t) => t.id !== id));
  };

  return (
    <div>
      <h1>Trail Log</h1>

      <div data-testid="stats">
        <span data-testid="stat-total">{filtered.length} trails</span>
        <span data-testid="stat-miles">{totalMiles.toFixed(1)} mi</span>
        <span data-testid="stat-avg-rating">{avgRating}</span>
      </div>

      <div data-testid="filter-bar">
        <label htmlFor="difficulty-filter">Filter by difficulty:</label>
        <select
          id="difficulty-filter"
          data-testid="difficulty-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as "All" | Difficulty)}
        >
          <option value="All">All</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div data-testid="trail-list">
        {filtered.length === 0 ? (
          <p data-testid="no-trails">No trails found.</p>
        ) : (
          filtered.map((trail) => (
            <div key={trail.id} data-testid={`trail-${trail.id}`}>
              <span data-testid={`trail-name-${trail.id}`}>{trail.name}</span>
              <span data-testid={`trail-distance-${trail.id}`}>{trail.distance.toFixed(1)} mi</span>
              <span data-testid={`trail-difficulty-${trail.id}`}>{trail.difficulty}</span>
              <span data-testid={`trail-date-${trail.id}`}>{trail.date}</span>
              <span data-testid={`trail-rating-${trail.id}`}>
                {"★".repeat(trail.rating)}{"☆".repeat(5 - trail.rating)}
              </span>
              <button data-testid={`delete-${trail.id}`} onClick={() => deleteTrail(trail.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div data-testid="add-trail-form">
        <input
          data-testid="form-name"
          type="text"
          placeholder="Trail name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
        <input
          data-testid="form-distance"
          type="number"
          placeholder="Distance (mi)"
          value={formDistance}
          onChange={(e) => setFormDistance(e.target.value)}
        />
        <select
          data-testid="form-difficulty"
          value={formDifficulty}
          onChange={(e) => setFormDifficulty(e.target.value as Difficulty)}
        >
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <input
          data-testid="form-date"
          type="date"
          value={formDate}
          onChange={(e) => setFormDate(e.target.value)}
        />
        <select
          data-testid="form-rating"
          value={formRating}
          onChange={(e) => setFormRating(e.target.value)}
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <button data-testid="log-trail-btn" onClick={addTrail}>
          Log Trail
        </button>
      </div>
    </div>
  );
}
