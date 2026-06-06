import React, { useState } from "react";

type TradeStatus = "Pending" | "Accepted" | "Rejected";

interface Trade {
  id: number;
  date: string;
  playersGave: string;
  opponent: string;
  playersGot: string;
  status: TradeStatus;
}

const INITIAL_TRADES: Trade[] = [
  {
    id: 1,
    date: "2024-09-15",
    playersGave: "Patrick Mahomes",
    opponent: "Team Chaos",
    playersGot: "Justin Jefferson, Davante Adams",
    status: "Accepted",
  },
  {
    id: 2,
    date: "2024-09-22",
    playersGave: "Saquon Barkley, Diontae Johnson",
    opponent: "Team Alpha",
    playersGot: "Travis Kelce",
    status: "Accepted",
  },
  {
    id: 3,
    date: "2024-10-01",
    playersGave: "Jaylen Waddle",
    opponent: "Team Beta",
    playersGot: "Dalvin Cook",
    status: "Pending",
  },
];

const STATUS_COLORS: Record<TradeStatus, string> = {
  Accepted: "#38a169",
  Pending: "#d69e2e",
  Rejected: "#e53e3e",
};

export default function App() {
  const [trades, setTrades] = useState<Trade[]>(INITIAL_TRADES);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [formDate, setFormDate] = useState("");
  const [formGave, setFormGave] = useState("");
  const [formOpponent, setFormOpponent] = useState("");
  const [formGot, setFormGot] = useState("");
  const [formStatus, setFormStatus] = useState<TradeStatus>("Pending");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formDate || !formGave.trim() || !formOpponent.trim() || !formGot.trim()) return;
    const newTrade: Trade = {
      id: trades.length + Date.now(),
      date: formDate,
      playersGave: formGave.trim(),
      opponent: formOpponent.trim(),
      playersGot: formGot.trim(),
      status: formStatus,
    };
    setTrades((prev) => [...prev, newTrade]);
    setFormDate("");
    setFormGave("");
    setFormOpponent("");
    setFormGot("");
    setFormStatus("Pending");
  }

  const filtered = statusFilter === "All"
    ? trades
    : trades.filter((t) => t.status === statusFilter);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1 data-testid="app-title">Trade Log</h1>

      <form data-testid="trade-form" onSubmit={handleSubmit}
        style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24, padding: 16, background: "#f7fafc", borderRadius: 8 }}>
        <div>
          <label htmlFor="trade-date">Date</label>
          <br />
          <input id="trade-date" data-testid="input-date" type="date" value={formDate}
            onChange={(e) => setFormDate(e.target.value)} required
            style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc" }} />
        </div>
        <div>
          <label htmlFor="trade-gave">Players Gave</label>
          <br />
          <input id="trade-gave" data-testid="input-gave" type="text" value={formGave}
            onChange={(e) => setFormGave(e.target.value)} placeholder="Player names"
            style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc" }} />
        </div>
        <div>
          <label htmlFor="trade-opponent">Opponent Team</label>
          <br />
          <input id="trade-opponent" data-testid="input-opponent" type="text" value={formOpponent}
            onChange={(e) => setFormOpponent(e.target.value)} placeholder="Team name"
            style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc" }} />
        </div>
        <div>
          <label htmlFor="trade-got">Players Got</label>
          <br />
          <input id="trade-got" data-testid="input-got" type="text" value={formGot}
            onChange={(e) => setFormGot(e.target.value)} placeholder="Player names"
            style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc" }} />
        </div>
        <div>
          <label htmlFor="trade-status">Status</label>
          <br />
          <select id="trade-status" data-testid="input-status" value={formStatus}
            onChange={(e) => setFormStatus(e.target.value as TradeStatus)}
            style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc" }}>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button data-testid="submit-trade" type="submit"
            style={{ background: "#3182ce", color: "white", border: "none", padding: "6px 16px", borderRadius: 4, cursor: "pointer" }}>
            Log Trade
          </button>
        </div>
      </form>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
        <span data-testid="trade-count">Trades: {filtered.length}</span>
        <select data-testid="status-filter" value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc" }}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <table data-testid="trade-table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #eee" }}>Date</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #eee" }}>Sent</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #eee" }}>Received</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #eee" }}>Opponent</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #eee" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((trade) => (
            <tr key={trade.id} data-testid={`trade-row-${trade.id}`}>
              <td data-testid={`trade-date-${trade.id}`} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                {trade.date}
              </td>
              <td data-testid={`trade-gave-${trade.id}`} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                {trade.playersGave}
              </td>
              <td data-testid={`trade-got-${trade.id}`} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                {trade.playersGot}
              </td>
              <td data-testid={`trade-opponent-${trade.id}`} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                {trade.opponent}
              </td>
              <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                <span data-testid={`trade-status-${trade.id}`}
                  style={{
                    background: STATUS_COLORS[trade.status],
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontSize: 13,
                  }}>
                  {trade.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
