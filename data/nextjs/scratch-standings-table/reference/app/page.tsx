import React, { useState } from "react";

interface Team {
  id: number;
  team: string;
  manager: string;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  streak: string;
}

type SortKey = "wins" | "losses" | "pointsFor" | "pointsAgainst";

const TEAMS: Team[] = [
  { id: 1, team: "Thunder Hawks", manager: "Alice", wins: 7, losses: 2, ties: 0, pointsFor: 1245.6, pointsAgainst: 1102.3, streak: "W3" },
  { id: 2, team: "Grid Iron Kings", manager: "Bob", wins: 6, losses: 3, ties: 0, pointsFor: 1198.4, pointsAgainst: 1089.7, streak: "W1" },
  { id: 3, team: "Blitz Brigade", manager: "Carol", wins: 6, losses: 3, ties: 0, pointsFor: 1178.2, pointsAgainst: 1134.5, streak: "L1" },
  { id: 4, team: "End Zone Elite", manager: "Dave", wins: 5, losses: 4, ties: 0, pointsFor: 1156.8, pointsAgainst: 1120.0, streak: "W2" },
  { id: 5, team: "Red Zone Raiders", manager: "Eve", wins: 4, losses: 5, ties: 0, pointsFor: 1098.3, pointsAgainst: 1178.9, streak: "L2" },
  { id: 6, team: "Touchdown Titans", manager: "Frank", wins: 3, losses: 6, ties: 0, pointsFor: 1034.7, pointsAgainst: 1189.2, streak: "L3" },
  { id: 7, team: "Field Goal Force", manager: "Grace", wins: 3, losses: 6, ties: 0, pointsFor: 1022.1, pointsAgainst: 1201.5, streak: "W1" },
  { id: 8, team: "Fumble Factory", manager: "Hank", wins: 2, losses: 7, ties: 0, pointsFor: 987.4, pointsAgainst: 1245.6, streak: "L4" },
];

export default function App() {
  const [sortKey, setSortKey] = useState<SortKey>("wins");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = [...TEAMS].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const dir = sortDir === "desc" ? -1 : 1;
    if (aVal !== bVal) return (aVal - bVal) * dir;
    // tiebreaker: pointsFor desc
    return b.pointsFor - a.pointsFor;
  });

  const playoffTeams = sorted.slice(0, 4);

  function arrow(key: SortKey) {
    if (key !== sortKey) return "";
    return sortDir === "desc" ? " ↓" : " ↑";
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1 data-testid="app-title">League Standings</h1>

      <table data-testid="standings-table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 32 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #eee" }}>Rank</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #eee" }}>Team</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #eee" }}>Manager</th>
            <th data-testid="sort-wins" onClick={() => handleSort("wins")} style={{ textAlign: "center", padding: 8, borderBottom: "2px solid #eee", cursor: "pointer" }}>
              W{arrow("wins")}
            </th>
            <th data-testid="sort-losses" onClick={() => handleSort("losses")} style={{ textAlign: "center", padding: 8, borderBottom: "2px solid #eee", cursor: "pointer" }}>
              L{arrow("losses")}
            </th>
            <th style={{ textAlign: "center", padding: 8, borderBottom: "2px solid #eee" }}>T</th>
            <th data-testid="sort-pf" onClick={() => handleSort("pointsFor")} style={{ textAlign: "right", padding: 8, borderBottom: "2px solid #eee", cursor: "pointer" }}>
              PF{arrow("pointsFor")}
            </th>
            <th data-testid="sort-pa" onClick={() => handleSort("pointsAgainst")} style={{ textAlign: "right", padding: 8, borderBottom: "2px solid #eee", cursor: "pointer" }}>
              PA{arrow("pointsAgainst")}
            </th>
            <th style={{ textAlign: "center", padding: 8, borderBottom: "2px solid #eee" }}>Streak</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((team, idx) => (
            <tr key={team.id} data-testid={`team-row-${team.id}`}
              style={{ background: idx < 4 ? "#f0fff4" : "white" }}>
              <td data-testid={`team-rank-${team.id}`} style={{ padding: 8, borderBottom: "1px solid #eee", fontWeight: "bold" }}>
                {idx + 1}
              </td>
              <td data-testid={`team-name-${team.id}`} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                {team.team}
              </td>
              <td data-testid={`team-manager-${team.id}`} style={{ padding: 8, borderBottom: "1px solid #eee", color: "#666" }}>
                {team.manager}
              </td>
              <td data-testid={`team-wins-${team.id}`} style={{ textAlign: "center", padding: 8, borderBottom: "1px solid #eee" }}>
                {team.wins}
              </td>
              <td data-testid={`team-losses-${team.id}`} style={{ textAlign: "center", padding: 8, borderBottom: "1px solid #eee" }}>
                {team.losses}
              </td>
              <td data-testid={`team-ties-${team.id}`} style={{ textAlign: "center", padding: 8, borderBottom: "1px solid #eee" }}>
                {team.ties}
              </td>
              <td data-testid={`team-pf-${team.id}`} style={{ textAlign: "right", padding: 8, borderBottom: "1px solid #eee" }}>
                {team.pointsFor.toFixed(1)}
              </td>
              <td data-testid={`team-pa-${team.id}`} style={{ textAlign: "right", padding: 8, borderBottom: "1px solid #eee" }}>
                {team.pointsAgainst.toFixed(1)}
              </td>
              <td data-testid={`team-streak-${team.id}`} style={{ textAlign: "center", padding: 8, borderBottom: "1px solid #eee" }}>
                {team.streak}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <section>
        <h2 data-testid="playoff-heading">Playoff Picture</h2>
        <ul data-testid="playoff-list" style={{ listStyle: "none", padding: 0 }}>
          {playoffTeams.map((team, idx) => (
            <li key={team.id} data-testid={`playoff-team-${idx + 1}`}
              style={{ display: "flex", gap: 12, padding: "6px 0", borderBottom: "1px solid #eee" }}>
              <span style={{ fontWeight: "bold", width: 24 }}>{idx + 1}</span>
              <span data-testid={`playoff-name-${idx + 1}`}>{team.team}</span>
              <span style={{ color: "#666" }}>{team.manager}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
