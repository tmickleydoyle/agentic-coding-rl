import { Shareholder, Round } from "./types";

const SEED_SHAREHOLDERS: Shareholder[] = [
  { id: "1", name: "Alice Founder", type: "Founder", shares: 4000000 },
  { id: "2", name: "Bob Founder", type: "Founder", shares: 3000000 },
  { id: "3", name: "Accel Fund", type: "Investor", shares: 2000000 },
  { id: "4", name: "Carol Advisor", type: "Advisor", shares: 100000 },
];

const SEED_ROUNDS: Round[] = [
  { id: "1", name: "Seed", date: "2023-06-01", sharePrice: 1.00, newShares: 2000000 },
  { id: "2", name: "Series A", date: "2024-01-15", sharePrice: 5.00, newShares: 1000000 },
];

let shareholders: Shareholder[] = SEED_SHAREHOLDERS.map((s) => ({ ...s }));
let rounds: Round[] = SEED_ROUNDS.map((r) => ({ ...r }));
let nextShareholderId = 5;
let nextRoundId = 3;

export function getShareholders(): Shareholder[] {
  return shareholders.map((s) => ({ ...s }));
}

export function addShareholder(data: Omit<Shareholder, "id">): Shareholder {
  const s: Shareholder = { ...data, id: String(nextShareholderId++) };
  shareholders.push(s);
  return { ...s };
}

export function deleteShareholder(id: string): boolean {
  const idx = shareholders.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  shareholders.splice(idx, 1);
  return true;
}

export function getRounds(): Round[] {
  return rounds.map((r) => ({ ...r }));
}

export function addRound(data: Omit<Round, "id">): Round {
  const r: Round = { ...data, id: String(nextRoundId++) };
  rounds.push(r);
  return { ...r };
}

export function getTotalShares(): number {
  return shareholders.reduce((sum, s) => sum + s.shares, 0);
}

export function getLatestSharePrice(): number | null {
  if (rounds.length === 0) return null;
  return rounds[rounds.length - 1].sharePrice;
}

export function __reset(): void {
  shareholders = SEED_SHAREHOLDERS.map((s) => ({ ...s }));
  rounds = SEED_ROUNDS.map((r) => ({ ...r }));
  nextShareholderId = 5;
  nextRoundId = 3;
}
