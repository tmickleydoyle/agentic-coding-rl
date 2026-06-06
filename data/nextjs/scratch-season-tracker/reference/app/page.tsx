import React, { useState } from "react";

interface Team {
  id: number;
  name: string;
  w: number;
  l: number;
  d: number;
  gf: number;
  ga: number;
}

function points(t: Team): number {
  return t.w * 3 + t.d;
}

function gd(t: Team): number {
  return t.gf - t.ga;
}

const SEED: Team[] = [
  { id: 1, name: "Summit City FC", w: 8, l: 2, d: 2, gf: 26, ga: 12 },
  { id: 2, name: "River Rovers", w: 7, l: 3, d: 2, gf: 22, ga: 15 },
  { id: 3, name: "Valley Athletic", w: 6, l: 3, d: 3, gf: 18, ga: 14 },
  { id: 4, name: "Eastport United", w: 5, l: 5, d: 2, gf: 17, ga: 18 },
  { id: 5, name: "Harbor Hawks", w: 3, l: 6, d: 3, gf: 14, ga: 20 },
  { id: 6, name: "Coastal Wanderers", w: 1, l: 9, d: 2, gf: 8, ga: 26 },
];

function sortTeams(teams: Team[]): Team[] {
  return [...teams].sort((a, b) => {
    const pdiff = points(b) - points(a);
    if (pdiff !== 0) return pdiff;
    return gd(b) - gd(a);
  });
}

export default function App() {
  const [teams, setTeams] = useState<Team[]>(SEED.map((t) => ({ ...t })));
  const [homeId, setHomeId] = useState<number>(SEED[0].id);
  const [awayId, setAwayId] = useState<number>(SEED[1].id);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  const sorted = sortTeams(teams);

  function handleRecord() {
    if (homeId === awayId) return;
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === homeId) {
          const win = homeScore > awayScore;
          const draw = homeScore === awayScore;
          return {
            ...t,
            w: t.w + (win ? 1 : 0),
            l: t.l + (homeScore < awayScore ? 1 : 0),
            d: t.d + (draw ? 1 : 0),
            gf: t.gf + homeScore,
            ga: t.ga + awayScore,
          };
        }
        if (t.id === awayId) {
          const win = awayScore > homeScore;
          const draw = homeScore === awayScore;
          return {
            ...t,
            w: t.w + (win ? 1 : 0),
            l: t.l + (awayScore < homeScore ? 1 : 0),
            d: t.d + (draw ? 1 : 0),
            gf: t.gf + awayScore,
            ga: t.ga + homeScore,
          };
        }
        return t;
      })
    );
    setHomeScore(0);
    setAwayScore(0);
  }

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Season Tracker</h1>

      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
        <label>Home Team</label>
        <select
          data-testid="select-home"
          value={homeId}
          onChange={(e) => setHomeId(Number(e.target.value))}
        >
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <input
          type="number"
          data-testid="input-home-score"
          value={homeScore}
          onChange={(e) => setHomeScore(Number(e.target.value))}
          min={0}
          style={{ width: "60px" }}
        />
        <span>vs</span>
        <input
          type="number"
          data-testid="input-away-score"
          value={awayScore}
          onChange={(e) => setAwayScore(Number(e.target.value))}
          min={0}
          style={{ width: "60px" }}
        />
        <label>Away Team</label>
        <select
          data-testid="select-away"
          value={awayId}
          onChange={(e) => setAwayId(Number(e.target.value))}
        >
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <button data-testid="btn-record" onClick={handleRecord}>Record Result</button>
      </div>

      <table data-testid="standings-table" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {["Rank", "Team", "W", "L", "D", "GF", "GA", "GD", "Points"].map((h) => (
              <th key={h} style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((t, idx) => (
            <tr key={t.id} data-testid="team-row">
              <td data-testid="row-rank" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{idx + 1}</td>
              <td data-testid="row-team" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{t.name}</td>
              <td data-testid="row-wins" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{t.w}</td>
              <td data-testid="row-losses" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{t.l}</td>
              <td data-testid="row-draws" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{t.d}</td>
              <td data-testid="row-gf" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{t.gf}</td>
              <td data-testid="row-ga" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{t.ga}</td>
              <td data-testid="row-gd" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{gd(t)}</td>
              <td data-testid="row-points" style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{points(t)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
