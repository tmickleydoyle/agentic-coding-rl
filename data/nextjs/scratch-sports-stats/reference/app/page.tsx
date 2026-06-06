import React, { useState } from "react";

type Position = "Guard" | "Forward" | "Center";
type SortKey = "name" | "position" | "games" | "points" | "rebounds" | "assists" | "fg";

interface Player {
  id: number;
  name: string;
  position: Position;
  games: number;
  points: number;
  rebounds: number;
  assists: number;
  fg: number;
}

const PLAYERS: Player[] = [
  { id: 1, name: "Marcus Jordan", position: "Guard", games: 32, points: 24.5, rebounds: 3.2, assists: 7.8, fg: 48.2 },
  { id: 2, name: "Devon Williams", position: "Forward", games: 30, points: 18.3, rebounds: 8.1, assists: 3.4, fg: 51.6 },
  { id: 3, name: "Chris Okafor", position: "Center", games: 29, points: 12.7, rebounds: 11.4, assists: 1.2, fg: 55.3 },
  { id: 4, name: "Layla Thompson", position: "Guard", games: 31, points: 21.0, rebounds: 4.5, assists: 6.3, fg: 44.7 },
  { id: 5, name: "Sam Reyes", position: "Forward", games: 28, points: 15.6, rebounds: 7.9, assists: 2.8, fg: 49.1 },
  { id: 6, name: "Tony Kowalski", position: "Center", games: 27, points: 9.4, rebounds: 13.2, assists: 0.9, fg: 58.8 },
];

type FilterOption = "All" | Position;

export default function App() {
  const [filter, setFilter] = useState<FilterOption>("All");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDesc, setSortDesc] = useState(false);

  const filtered = filter === "All" ? PLAYERS : PLAYERS.filter((p) => p.position === filter);

  const sorted = sortKey === null
    ? filtered
    : [...filtered].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        let cmp: number;
        if (typeof av === "string" && typeof bv === "string") {
          cmp = av.localeCompare(bv);
        } else {
          cmp = (av as number) - (bv as number);
        }
        return sortDesc ? -cmp : cmp;
      });

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDesc((d) => !d);
    } else {
      setSortKey(key);
      setSortDesc(false);
    }
  }

  function indicator(key: SortKey) {
    if (sortKey !== key) return null;
    return sortDesc ? " ▼" : " ▲";
  }

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Sports Stats</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="position-filter">Filter by Position</label>{" "}
        <select
          id="position-filter"
          data-testid="position-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterOption)}
        >
          <option value="All">All</option>
          <option value="Guard">Guard</option>
          <option value="Forward">Forward</option>
          <option value="Center">Center</option>
        </select>
      </div>

      <table data-testid="stats-table" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {(
              [
                ["name", "Name"],
                ["position", "Position"],
                ["games", "Games"],
                ["points", "Points"],
                ["rebounds", "Rebounds"],
                ["assists", "Assists"],
                ["fg", "FG%"],
              ] as [SortKey, string][]
            ).map(([key, label]) => (
              <th key={key} style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                <button onClick={() => handleSort(key)} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                  {label}{indicator(key)}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.id} data-testid="player-row">
              <td data-testid="cell-name" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.name}</td>
              <td data-testid="cell-position" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.position}</td>
              <td data-testid="cell-games" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.games}</td>
              <td data-testid="cell-points" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.points}</td>
              <td data-testid="cell-rebounds" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.rebounds}</td>
              <td data-testid="cell-assists" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.assists}</td>
              <td data-testid="cell-fg" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{p.fg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
