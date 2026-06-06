"use client";
import React, { useState } from "react";

type RoundStatus = "Pending" | "Accepted" | "Rejected";

interface NegotiationRound {
  id: number;
  round: number;
  offerAmount: number;
  counterAmount: number;
  tactic: string;
  date: string;
  status: RoundStatus;
}

interface NegotiationInfo {
  company: string;
  role: string;
  initialOffer: number;
  targetSalary: number;
  deadline: string;
}

const ACTIVE: NegotiationInfo = {
  company: "TechCorp",
  role: "Senior Engineer",
  initialOffer: 130000,
  targetSalary: 155000,
  deadline: "2024-02-15",
};

const SEED_ROUNDS: NegotiationRound[] = [
  { id: 1, round: 1, offerAmount: 130000, counterAmount: 145000, tactic: "Cited market rate data from Levels.fyi", date: "2024-01-15", status: "Pending" },
  { id: 2, round: 2, offerAmount: 138000, counterAmount: 150000, tactic: "Mentioned competing offer from Beta Inc", date: "2024-01-20", status: "Pending" },
  { id: 3, round: 3, offerAmount: 145000, counterAmount: 155000, tactic: "Asked for signing bonus as alternative", date: "2024-01-25", status: "Accepted" },
];

const TACTICS = [
  "Research market rates on Glassdoor and Levels.fyi",
  "Mention competing offers without revealing exact amounts",
  "Request signing bonus as a compromise",
  "Emphasize unique skills and recent accomplishments",
];

const STATUS_OPTIONS: RoundStatus[] = ["Pending", "Accepted", "Rejected"];

export default function App() {
  const [rounds, setRounds] = useState<NegotiationRound[]>(SEED_ROUNDS);
  const [nextId, setNextId] = useState(4);

  const [formOffer, setFormOffer] = useState("");
  const [formCounter, setFormCounter] = useState("");
  const [formTactic, setFormTactic] = useState("");
  const [formDate, setFormDate] = useState("");

  const latestRound = rounds.length > 0 ? rounds[rounds.length - 1] : null;
  const latestCounter = latestRound ? latestRound.counterAmount : ACTIVE.initialOffer;
  const gap = ACTIVE.targetSalary - latestCounter;
  const range = ACTIVE.targetSalary - ACTIVE.initialOffer;
  const progress = range > 0 ? Math.min(100, Math.max(0, ((latestCounter - ACTIVE.initialOffer) / range) * 100)) : 0;

  function handleAddRound() {
    if (!formOffer.trim() || !formCounter.trim()) return;
    const newRound: NegotiationRound = {
      id: nextId,
      round: rounds.length + 1,
      offerAmount: parseInt(formOffer) || 0,
      counterAmount: parseInt(formCounter) || 0,
      tactic: formTactic.trim(),
      date: formDate,
      status: "Pending",
    };
    setRounds([...rounds, newRound]);
    setNextId(nextId + 1);
    setFormOffer(""); setFormCounter(""); setFormTactic(""); setFormDate("");
  }

  function handleDeleteRound(id: number) {
    setRounds(rounds.filter((r) => r.id !== id));
  }

  function handleStatusChange(id: number, status: RoundStatus) {
    setRounds(rounds.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  function handleCopyTactic(tactic: string) {
    setFormTactic(tactic);
  }

  return (
    <div>
      <h1>Salary Negotiation Tracker</h1>

      <div>
        <p data-testid="active-company">{ACTIVE.company}</p>
        <p data-testid="active-role">{ACTIVE.role}</p>
        <p data-testid="initial-offer">{ACTIVE.initialOffer}</p>
        <p data-testid="target-salary">{ACTIVE.targetSalary}</p>
        <p data-testid="deadline">{ACTIVE.deadline}</p>
        <p data-testid="gap">{gap}</p>
      </div>

      <div data-testid="progress-bar" style={{ width: `${progress}%`, height: "8px", background: "green" }} />

      <div>
        {rounds.map((r) => (
          <div key={r.id} data-testid={`round-card-${r.id}`}>
            <p>Round {r.round}</p>
            <p>{r.date}</p>
            <p>Offer: {r.offerAmount}</p>
            <p>Counter: {r.counterAmount}</p>
            <p>{r.tactic}</p>
            <span data-testid={`round-status-${r.id}`}>{r.status}</span>
            <select
              data-testid={`status-select-${r.id}`}
              value={r.status}
              onChange={(e) => handleStatusChange(r.id, e.target.value as RoundStatus)}
            >
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button data-testid={`delete-round-${r.id}`} onClick={() => handleDeleteRound(r.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div>
        <input data-testid="input-round-offer" type="text" placeholder="Offer Amount" value={formOffer} onChange={(e) => setFormOffer(e.target.value)} />
        <input data-testid="input-round-counter" type="text" placeholder="Counter Amount" value={formCounter} onChange={(e) => setFormCounter(e.target.value)} />
        <input data-testid="input-round-tactic" type="text" placeholder="Tactic" value={formTactic} onChange={(e) => setFormTactic(e.target.value)} />
        <input data-testid="input-round-date" type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
        <button data-testid="add-round-btn" onClick={handleAddRound}>Add Round</button>
      </div>

      <div>
        <h2>Tactics Library</h2>
        {TACTICS.map((tactic, idx) => (
          <div key={idx}>
            <p data-testid={`tactic-${idx}`}>{tactic}</p>
            <button data-testid={`copy-tactic-${idx}`} onClick={() => handleCopyTactic(tactic)}>Copy</button>
          </div>
        ))}
      </div>
    </div>
  );
}
