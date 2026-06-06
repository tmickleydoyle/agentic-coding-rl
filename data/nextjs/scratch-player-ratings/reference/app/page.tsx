import React, { useState } from "react";

interface PlayerData {
  id: number;
  name: string;
  position: string;
  ratings: number[];
}

const SEED: PlayerData[] = [
  { id: 1, name: "Jordan Blake", position: "Forward", ratings: [4, 5, 3] },
  { id: 2, name: "Riley Chen", position: "Midfielder", ratings: [3, 3, 4] },
  { id: 3, name: "Morgan Davis", position: "Defender", ratings: [5, 4, 5] },
  { id: 4, name: "Casey Kim", position: "Forward", ratings: [2, 3, 2] },
  { id: 5, name: "Taylor Nguyen", position: "Goalkeeper", ratings: [4, 4, 3] },
];

type SortOption = "Default" | "Highest Rated" | "Lowest Rated";

function avg(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((a, b) => a + b, 0) / ratings.length;
}

export default function App() {
  const [players, setPlayers] = useState<PlayerData[]>(SEED.map((p) => ({ ...p, ratings: [...p.ratings] })));
  const [selectedStars, setSelectedStars] = useState<Record<number, number | null>>({});
  const [sortOption, setSortOption] = useState<SortOption>("Default");

  function handleSelectStar(playerId: number, star: number) {
    setSelectedStars((prev) => ({ ...prev, [playerId]: star }));
  }

  function handleSubmit(playerId: number) {
    const star = selectedStars[playerId];
    if (!star) return;
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId ? { ...p, ratings: [...p.ratings, star] } : p
      )
    );
    setSelectedStars((prev) => ({ ...prev, [playerId]: null }));
  }

  const allRatings = players.flatMap((p) => p.ratings);
  const teamAvg = allRatings.length > 0 ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length : 0;

  const sorted = (() => {
    if (sortOption === "Highest Rated") return [...players].sort((a, b) => avg(b.ratings) - avg(a.ratings));
    if (sortOption === "Lowest Rated") return [...players].sort((a, b) => avg(a.ratings) - avg(b.ratings));
    return players;
  })();

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Player Ratings</h1>

      <div style={{ marginBottom: "1rem" }}>
        <span>Team Average: </span>
        <strong data-testid="team-average">{teamAvg.toFixed(2)}</strong>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="sort-select">Sort by</label>{" "}
        <select
          id="sort-select"
          data-testid="sort-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
        >
          <option value="Default">Default</option>
          <option value="Highest Rated">Highest Rated</option>
          <option value="Lowest Rated">Lowest Rated</option>
        </select>
      </div>

      <div>
        {sorted.map((p) => {
          const playerAvg = avg(p.ratings);
          const selected = selectedStars[p.id] ?? null;
          return (
            <div
              key={p.id}
              data-testid="rating-card"
              style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "1rem", marginBottom: "0.75rem" }}
            >
              <div>
                <strong data-testid="card-player-name">{p.name}</strong>
                {" — "}
                <span data-testid="card-position">{p.position}</span>
              </div>
              <div>
                Average: <span data-testid="card-average">{playerAvg.toFixed(2)}</span>
                {" | "}
                <span data-testid="card-count">{p.ratings.length} ratings</span>
              </div>
              <div style={{ display: "flex", gap: "0.25rem", margin: "0.5rem 0" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    data-testid={`star-${s}`}
                    onClick={() => handleSelectStar(p.id, s)}
                    style={{
                      fontWeight: selected === s ? "bold" : "normal",
                      border: selected === s ? "2px solid #333" : "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "0.25rem 0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button data-testid="btn-submit-rating" onClick={() => handleSubmit(p.id)}>
                Submit Rating
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
