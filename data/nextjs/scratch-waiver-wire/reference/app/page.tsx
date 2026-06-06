import React, { useState } from "react";

interface Player {
  id: number;
  name: string;
  position: string;
  team: string;
  ownership: number;
  waiverOrder: number;
}

interface Claim {
  id: number;
  playerId: number;
  playerName: string;
  dropPlayer: string;
  priority: number;
}

const AVAILABLE_PLAYERS: Player[] = [
  { id: 1, name: "Miles Sanders", position: "RB", team: "CAR", ownership: 12, waiverOrder: 1 },
  { id: 2, name: "Gus Edwards", position: "RB", team: "BAL", ownership: 8, waiverOrder: 2 },
  { id: 3, name: "Rashod Bateman", position: "WR", team: "BAL", ownership: 22, waiverOrder: 3 },
  { id: 4, name: "Kadarius Toney", position: "WR", team: "KC", ownership: 18, waiverOrder: 4 },
  { id: 5, name: "Cole Kmet", position: "TE", team: "CHI", ownership: 31, waiverOrder: 5 },
  { id: 6, name: "Sam LaPorta", position: "TE", team: "DET", ownership: 45, waiverOrder: 6 },
  { id: 7, name: "Malik Willis", position: "QB", team: "TEN", ownership: 5, waiverOrder: 7 },
];

const INITIAL_CLAIMS: Claim[] = [
  { id: 1, playerId: 3, playerName: "Rashod Bateman", dropPlayer: "Diontae Johnson", priority: 1 },
  { id: 2, playerId: 6, playerName: "Sam LaPorta", dropPlayer: "Irv Smith Jr", priority: 2 },
];

export default function App() {
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
  const [openClaim, setOpenClaim] = useState<number | null>(null);
  const [dropInput, setDropInput] = useState<string>("");

  function handleClaim(player: Player) {
    if (openClaim === player.id) {
      setOpenClaim(null);
      setDropInput("");
    } else {
      setOpenClaim(player.id);
      setDropInput("");
    }
  }

  function submitClaim(player: Player) {
    if (!dropInput.trim()) return;
    const newPriority = claims.length + 1;
    const newClaim: Claim = {
      id: Date.now(),
      playerId: player.id,
      playerName: player.name,
      dropPlayer: dropInput.trim(),
      priority: newPriority,
    };
    setClaims((prev) => [...prev, newClaim]);
    setOpenClaim(null);
    setDropInput("");
  }

  function cancelClaim(claimId: number) {
    setClaims((prev) => prev.filter((c) => c.id !== claimId));
  }

  const sortedClaims = [...claims].sort((a, b) => a.priority - b.priority);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1 data-testid="app-title">Waiver Wire</h1>

      <section style={{ marginBottom: 32 }}>
        <h2 data-testid="available-heading">Available Players</h2>
        <ul data-testid="available-list" style={{ listStyle: "none", padding: 0 }}>
          {AVAILABLE_PLAYERS.map((player) => (
            <li key={player.id} data-testid={`waiver-player-${player.id}`}
              style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span data-testid={`waiver-order-${player.id}`}
                  style={{ width: 24, color: "#999", fontSize: 12, fontWeight: "bold" }}>
                  {player.waiverOrder}
                </span>
                <span data-testid={`waiver-pos-${player.id}`}
                  style={{ background: "#ddd", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>
                  {player.position}
                </span>
                <span data-testid={`waiver-name-${player.id}`} style={{ flex: 1 }}>{player.name}</span>
                <span data-testid={`waiver-team-${player.id}`} style={{ color: "#666", fontSize: 13 }}>
                  {player.team}
                </span>
                <span data-testid={`waiver-ownership-${player.id}`} style={{ color: "#666", fontSize: 13 }}>
                  {player.ownership}%
                </span>
                <button data-testid={`claim-btn-${player.id}`} onClick={() => handleClaim(player)}
                  style={{ background: "#3182ce", color: "white", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer" }}>
                  Claim
                </button>
              </div>
              {openClaim === player.id && (
                <div data-testid={`claim-form-${player.id}`}
                  style={{ marginTop: 8, paddingLeft: 36, display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    data-testid={`drop-input-${player.id}`}
                    type="text"
                    placeholder="Drop player name"
                    value={dropInput}
                    onChange={(e) => setDropInput(e.target.value)}
                    style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc", flex: 1 }}
                  />
                  <button data-testid={`submit-claim-${player.id}`} onClick={() => submitClaim(player)}
                    style={{ background: "#38a169", color: "white", border: "none", padding: "4px 12px", borderRadius: 4, cursor: "pointer" }}>
                    Submit Claim
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 data-testid="claims-heading">My Claims ({claims.length})</h2>
        {claims.length === 0 ? (
          <p data-testid="no-claims">No pending claims</p>
        ) : (
          <ul data-testid="claims-list" style={{ listStyle: "none", padding: 0 }}>
            {sortedClaims.map((claim) => (
              <li key={claim.id} data-testid={`claim-row-${claim.id}`}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #eee" }}>
                <span data-testid={`claim-priority-${claim.id}`}
                  style={{ width: 24, fontWeight: "bold", color: "#3182ce" }}>
                  {claim.priority}
                </span>
                <span data-testid={`claim-add-${claim.id}`} style={{ flex: 1 }}>
                  Add: {claim.playerName}
                </span>
                <span data-testid={`claim-drop-${claim.id}`} style={{ flex: 1, color: "#666" }}>
                  Drop: {claim.dropPlayer}
                </span>
                <button data-testid={`cancel-claim-${claim.id}`} onClick={() => cancelClaim(claim.id)}
                  style={{ background: "#e53e3e", color: "white", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer" }}>
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
