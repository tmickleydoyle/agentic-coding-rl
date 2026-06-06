import React, { useState } from "react";

interface Tutorial {
  id: number;
  title: string;
  source: string;
  duration: number;
  rating: number;
  watched: boolean;
}

const SEED: Tutorial[] = [
  { id: 1, title: "Beginner Crochet Basics", source: "YouTube", duration: 45, rating: 5, watched: true },
  { id: 2, title: "Advanced Macrame Knots", source: "Skillshare", duration: 90, rating: 4, watched: false },
  { id: 3, title: "Watercolor Florals", source: "YouTube", duration: 30, rating: 5, watched: true },
  { id: 4, title: "Punch Needle Intro", source: "Udemy", duration: 60, rating: 3, watched: false },
];

export default function App() {
  const [tutorials, setTutorials] = useState<Tutorial[]>(SEED);
  const [nextId, setNextId] = useState(5);

  const [filterWatched, setFilterWatched] = useState<"all" | "watched" | "unwatched">("all");
  const [filterMinRating, setFilterMinRating] = useState<string>("Any");

  const [inputTitle, setInputTitle] = useState("");
  const [inputSource, setInputSource] = useState("");
  const [inputDuration, setInputDuration] = useState("");
  const [inputRating, setInputRating] = useState("");

  const handleAdd = () => {
    if (!inputTitle.trim()) return;
    const duration = parseInt(inputDuration, 10);
    if (!duration || duration <= 0) return;
    const rating = parseInt(inputRating, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) return;
    const newTutorial: Tutorial = {
      id: nextId,
      title: inputTitle.trim(),
      source: inputSource.trim(),
      duration,
      rating,
      watched: false,
    };
    setTutorials((prev) => [...prev, newTutorial]);
    setNextId((n) => n + 1);
    setInputTitle("");
    setInputSource("");
    setInputDuration("");
    setInputRating("");
  };

  const handleWatch = (id: number) => {
    setTutorials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, watched: true } : t))
    );
  };

  const handleDelete = (id: number) => {
    setTutorials((prev) => prev.filter((t) => t.id !== id));
  };

  const minRatingNum = filterMinRating === "Any" ? 1 : parseInt(filterMinRating, 10);

  const displayed = tutorials.filter((t) => {
    if (filterWatched === "watched" && !t.watched) return false;
    if (filterWatched === "unwatched" && t.watched) return false;
    if (t.rating < minRatingNum) return false;
    return true;
  });

  const totalWatchTime = tutorials
    .filter((t) => t.watched)
    .reduce((sum, t) => sum + t.duration, 0);

  return (
    <div>
      <h1>Tutorial Log</h1>

      <div>
        <label htmlFor="input-title">Title</label>
        <input
          id="input-title"
          data-testid="input-title"
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
        />
        <label htmlFor="input-source">Source</label>
        <input
          id="input-source"
          data-testid="input-source"
          type="text"
          value={inputSource}
          onChange={(e) => setInputSource(e.target.value)}
        />
        <label htmlFor="input-duration">Duration (min)</label>
        <input
          id="input-duration"
          data-testid="input-duration"
          type="number"
          value={inputDuration}
          onChange={(e) => setInputDuration(e.target.value)}
        />
        <label htmlFor="input-rating">Rating (1-5)</label>
        <input
          id="input-rating"
          data-testid="input-rating"
          type="number"
          value={inputRating}
          onChange={(e) => setInputRating(e.target.value)}
        />
        <button data-testid="btn-add" onClick={handleAdd}>
          Add Tutorial
        </button>
      </div>

      <div>
        <button data-testid="filter-all" onClick={() => setFilterWatched("all")}>All</button>
        <button data-testid="filter-watched" onClick={() => setFilterWatched("watched")}>Watched</button>
        <button data-testid="filter-unwatched" onClick={() => setFilterWatched("unwatched")}>Unwatched</button>
        <label htmlFor="filter-min-rating">Min Rating</label>
        <select
          id="filter-min-rating"
          data-testid="filter-min-rating"
          value={filterMinRating}
          onChange={(e) => setFilterMinRating(e.target.value)}
        >
          <option value="Any">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      <div data-testid="total-tutorials">{tutorials.length} tutorials</div>
      <div data-testid="total-watch-time">Total: {totalWatchTime} min</div>

      {displayed.length === 0 ? (
        <div data-testid="empty-msg">No tutorials found</div>
      ) : (
        <div>
          {displayed.map((t) => (
            <div key={t.id} data-testid={`tutorial-${t.id}`}>
              <span data-testid={`tutorial-title-${t.id}`}>{t.title}</span>
              <span data-testid={`tutorial-source-${t.id}`}>{t.source}</span>
              <span data-testid={`tutorial-duration-${t.id}`}>{t.duration} min</span>
              <span data-testid={`tutorial-rating-${t.id}`}>{t.rating}/5</span>
              <span data-testid={`tutorial-watched-${t.id}`}>
                {t.watched ? "Watched" : "Unwatched"}
              </span>
              {!t.watched && (
                <button
                  data-testid={`btn-watch-${t.id}`}
                  onClick={() => handleWatch(t.id)}
                >
                  Mark Watched
                </button>
              )}
              <button
                data-testid={`btn-delete-${t.id}`}
                onClick={() => handleDelete(t.id)}
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
