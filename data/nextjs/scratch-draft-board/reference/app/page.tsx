import React, { useState } from "react";

interface Player {
  id: number;
  name: string;
  position: string;
  rank: number;
  adp: number;
}

interface Pick {
  pickNum: number;
  player: Player;
}

const INITIAL_PLAYERS: Player[] = [
  { id: 1, name: "Christian McCaffrey", position: "RB", rank: 1, adp: 1.2 },
  { id: 2, name: "Justin Jefferson", position: "WR", rank: 2, adp: 2.1 },
  { id: 3, name: "Tyreek Hill", position: "WR", rank: 3, adp: 3.0 },
  { id: 4, name: "Travis Kelce", position: "TE", rank: 4, adp: 3.8 },
  { id: 5, name: "Stefon Diggs", position: "WR", rank: 5, adp: 4.5 },
  { id: 6, name: "Josh Allen", position: "QB", rank: 6, adp: 5.0 },
  { id: 7, name: "Patrick Mahomes", position: "QB", rank: 7, adp: 5.7 },
  { id: 8, name: "Davante Adams", position: "WR", rank: 8, adp: 6.2 },
  { id: 9, name: "Derrick Henry", position: "RB", rank: 9, adp: 7.1 },
  { id: 10, name: "Mark Andrews", position: "TE", rank: 10, adp: 8.0 },
];

const POSITIONS = ["All", "QB", "RB", "WR", "TE"];
const PICKS_PER_ROUND = 10;

export default function App() {
  const [available, setAvailable] = useState<Player[]>(INITIAL_PLAYERS);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [posFilter, setPosFilter] = useState<string>("All");

  const currentPick = picks.length + 1;
  const currentRound = Math.floor((picks.length) / PICKS_PER_ROUND) + 1;

  function draftPlayer(player: Player) {
    const newPick: Pick = { pickNum: currentPick, player };
    setPicks((prev) => [...prev, newPick]);
    setAvailable((prev) => prev.filter((p) => p.id !== player.id));
  }

  const filtered = posFilter === "All"
    ? available
    : available.filter((p) => p.position === posFilter);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1 data-testid="app-title">Draft Board</h1>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <span data-testid="current-pick">Pick: {currentPick}</span>
        <span data-testid="current-round">Round: {currentRound}</span>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {POSITIONS.map((pos) => (
          <button
            key={pos}
            data-testid={`filter-${pos.toLowerCase()}`}
            onClick={() => setPosFilter(pos)}
            style={{
              padding: "4px 12px",
              background: posFilter === pos ? "#3182ce" : "#e2e8f0",
              color: posFilter === pos ? "white" : "black",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {pos}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <section>
          <h2 data-testid="available-heading">Available Players</h2>
          {filtered.length === 0 ? (
            <p data-testid="no-available">No players available</p>
          ) : (
            <ul data-testid="available-list" style={{ listStyle: "none", padding: 0 }}>
              {filtered.map((player) => (
                <li key={player.id} data-testid={`available-player-${player.id}`}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #eee" }}>
                  <span data-testid={`avail-rank-${player.id}`} style={{ width: 24, color: "#999", fontSize: 12 }}>
                    {player.rank}
                  </span>
                  <span data-testid={`avail-pos-${player.id}`}
                    style={{ background: "#ddd", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>
                    {player.position}
                  </span>
                  <span data-testid={`avail-name-${player.id}`} style={{ flex: 1 }}>{player.name}</span>
                  <span data-testid={`avail-adp-${player.id}`} style={{ color: "#666", fontSize: 12 }}>
                    ADP {player.adp.toFixed(1)}
                  </span>
                  <button data-testid={`draft-btn-${player.id}`} onClick={() => draftPlayer(player)}
                    style={{ background: "#38a169", color: "white", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer" }}>
                    Draft
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 data-testid="picks-heading">My Picks ({picks.length})</h2>
          {picks.length === 0 ? (
            <p data-testid="no-picks">No picks yet</p>
          ) : (
            <ul data-testid="picks-list" style={{ listStyle: "none", padding: 0 }}>
              {picks.map((pick) => (
                <li key={pick.pickNum} data-testid={`pick-${pick.pickNum}`}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #eee" }}>
                  <span data-testid={`pick-num-${pick.pickNum}`}
                    style={{ width: 24, fontWeight: "bold", color: "#3182ce" }}>
                    {pick.pickNum}
                  </span>
                  <span data-testid={`pick-pos-${pick.pickNum}`}
                    style={{ background: "#ddd", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>
                    {pick.player.position}
                  </span>
                  <span data-testid={`pick-name-${pick.pickNum}`}>{pick.player.name}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
