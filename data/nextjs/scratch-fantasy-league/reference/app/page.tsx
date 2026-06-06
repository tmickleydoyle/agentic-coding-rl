import React, { useState } from "react";

interface Player {
  id: number;
  name: string;
  position: string;
  team: string;
  points: number;
}

const INITIAL_ROSTER: Player[] = [
  { id: 1, name: "Patrick Mahomes", position: "QB", team: "KC", points: 342 },
  { id: 2, name: "Derrick Henry", position: "RB", team: "TEN", points: 278 },
  { id: 3, name: "Davante Adams", position: "WR", team: "LV", points: 265 },
  { id: 4, name: "Travis Kelce", position: "TE", team: "KC", points: 301 },
  { id: 5, name: "Justin Jefferson", position: "WR", team: "MIN", points: 289 },
];

const INITIAL_FREE_AGENTS: Player[] = [
  { id: 6, name: "Josh Allen", position: "QB", team: "BUF", points: 330 },
  { id: 7, name: "Saquon Barkley", position: "RB", team: "NYG", points: 245 },
  { id: 8, name: "Tyreek Hill", position: "WR", team: "MIA", points: 270 },
  { id: 9, name: "Mark Andrews", position: "TE", team: "BAL", points: 280 },
];

export default function App() {
  const [roster, setRoster] = useState<Player[]>(INITIAL_ROSTER);
  const [freeAgents, setFreeAgents] = useState<Player[]>(INITIAL_FREE_AGENTS);

  const totalPoints = roster.reduce((sum, p) => sum + p.points, 0);

  function dropPlayer(player: Player) {
    setRoster((prev) => prev.filter((p) => p.id !== player.id));
    setFreeAgents((prev) => [...prev, player]);
  }

  function addPlayer(player: Player) {
    setFreeAgents((prev) => prev.filter((p) => p.id !== player.id));
    setRoster((prev) => [...prev, player]);
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1 data-testid="app-title">Fantasy League Manager</h1>

      <section>
        <h2 data-testid="roster-heading">Roster ({roster.length})</h2>
        <p data-testid="total-points">Total Points: {totalPoints}</p>
        {roster.length === 0 ? (
          <p data-testid="empty-roster">No players on roster</p>
        ) : (
          <ul data-testid="roster-list" style={{ listStyle: "none", padding: 0 }}>
            {roster.map((player) => (
              <li key={player.id} data-testid={`roster-player-${player.id}`}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #eee" }}>
                <span data-testid={`position-badge-${player.id}`}
                  style={{ background: "#ddd", padding: "2px 6px", borderRadius: 4, fontSize: 12, fontWeight: "bold" }}>
                  {player.position}
                </span>
                <span data-testid={`player-name-${player.id}`} style={{ flex: 1 }}>{player.name}</span>
                <span data-testid={`player-team-${player.id}`} style={{ color: "#666" }}>{player.team}</span>
                <span data-testid={`player-points-${player.id}`} style={{ fontWeight: "bold" }}>{player.points} pts</span>
                <button data-testid={`drop-btn-${player.id}`} onClick={() => dropPlayer(player)}
                  style={{ background: "#e53e3e", color: "white", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer" }}>
                  Drop
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: 32 }}>
        <h2 data-testid="free-agents-heading">Free Agents</h2>
        {freeAgents.length === 0 ? (
          <p data-testid="empty-free-agents">No free agents available</p>
        ) : (
          <ul data-testid="free-agents-list" style={{ listStyle: "none", padding: 0 }}>
            {freeAgents.map((player) => (
              <li key={player.id} data-testid={`fa-player-${player.id}`}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #eee" }}>
                <span data-testid={`fa-position-badge-${player.id}`}
                  style={{ background: "#ddd", padding: "2px 6px", borderRadius: 4, fontSize: 12, fontWeight: "bold" }}>
                  {player.position}
                </span>
                <span data-testid={`fa-player-name-${player.id}`} style={{ flex: 1 }}>{player.name}</span>
                <span data-testid={`fa-player-team-${player.id}`} style={{ color: "#666" }}>{player.team}</span>
                <span data-testid={`fa-player-points-${player.id}`} style={{ fontWeight: "bold" }}>{player.points} pts</span>
                <button data-testid={`add-btn-${player.id}`} onClick={() => addPlayer(player)}
                  style={{ background: "#38a169", color: "white", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer" }}>
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
