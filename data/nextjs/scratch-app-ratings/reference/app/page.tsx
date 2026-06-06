import React, { useState, useMemo } from "react";

interface AppEntry {
  id: number;
  name: string;
  category: string;
  rating: number;
  review: string;
  dateAdded: string;
}

const SEED_DATA: AppEntry[] = [
  { id: 1, name: "VS Code", category: "Editor", rating: 5, review: "Best editor ever, extensions are great", dateAdded: "2024-01-05" },
  { id: 2, name: "Slack", category: "Communication", rating: 3, review: "Good but gets noisy with large teams", dateAdded: "2024-01-08" },
  { id: 3, name: "Figma", category: "Design", rating: 5, review: "Incredible for collaborative design", dateAdded: "2024-01-10" },
  { id: 4, name: "Jira", category: "Project Management", rating: 2, review: "Overcomplicated for small teams", dateAdded: "2024-01-12" },
  { id: 5, name: "Notion", category: "Productivity", rating: 4, review: "Flexible but has a learning curve", dateAdded: "2024-01-15" },
];

export default function App() {
  const [apps, setApps] = useState<AppEntry[]>(SEED_DATA);
  const [sortBy, setSortBy] = useState<"date" | "rating" | "name">("date");
  const [filterCategory, setFilterCategory] = useState("All");
  const [nextId, setNextId] = useState(6);

  const [inputName, setInputName] = useState("");
  const [inputCategory, setInputCategory] = useState("");
  const [inputRating, setInputRating] = useState("");
  const [inputReview, setInputReview] = useState("");

  const averageRating = apps.length > 0
    ? apps.reduce((sum, a) => sum + a.rating, 0) / apps.length
    : 0;

  const categories = useMemo(() => {
    const cats = Array.from(new Set(apps.map((a) => a.category)));
    cats.sort();
    return cats;
  }, [apps]);

  const displayed = useMemo(() => {
    let result = filterCategory === "All" ? apps : apps.filter((a) => a.category === filterCategory);
    if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [apps, filterCategory, sortBy]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const rating = parseInt(inputRating, 10);
    if (!inputName.trim() || isNaN(rating) || rating < 1 || rating > 5) return;
    const newApp: AppEntry = {
      id: nextId,
      name: inputName.trim(),
      category: inputCategory.trim(),
      rating,
      review: inputReview.trim(),
      dateAdded: new Date().toISOString().slice(0, 10),
    };
    setApps((prev) => [...prev, newApp]);
    setNextId((n) => n + 1);
    setInputName("");
    setInputCategory("");
    setInputRating("");
    setInputReview("");
  }

  function handleRemove(id: number) {
    setApps((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div>
      <h1>App Ratings</h1>

      <div>
        <span data-testid="average-rating">{averageRating.toFixed(1)}</span>
        <span data-testid="total-apps">{apps.length}</span>
      </div>

      <div>
        <button data-testid="sort-rating" onClick={() => setSortBy("rating")}>
          Sort by Rating
        </button>
        <button data-testid="sort-name" onClick={() => setSortBy("name")}>
          Sort by Name
        </button>
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
      </div>

      <div>
        {displayed.length === 0 ? (
          <div data-testid="empty-message">No apps found.</div>
        ) : (
          displayed.map((a) => (
            <div key={a.id} data-testid="app-item">
              <span>{a.name}</span>
              <span>{a.category}</span>
              <span data-testid="app-rating">{a.rating}/5</span>
              <span>{a.review}</span>
              <span>{a.dateAdded}</span>
              <button data-testid="remove-app-btn" onClick={() => handleRemove(a.id)}>
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAdd}>
        <label>
          App Name
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
          Rating
          <input
            type="number"
            min={1}
            max={5}
            data-testid="input-rating"
            value={inputRating}
            onChange={(e) => setInputRating(e.target.value)}
          />
        </label>
        <label>
          Review
          <textarea
            data-testid="input-review"
            value={inputReview}
            onChange={(e) => setInputReview(e.target.value)}
          />
        </label>
        <button type="submit">Add App</button>
      </form>
    </div>
  );
}
