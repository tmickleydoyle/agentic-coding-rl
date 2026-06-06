import { Investor, Interaction } from "./types";

const SEED_INVESTORS: Investor[] = [
  { id: "1", name: "Alice Chen", firm: "Accel", email: "alice@accel.com", stage: "Meeting" },
  { id: "2", name: "Bob Patel", firm: "Sequoia", email: "bob@sequoia.com", stage: "Term Sheet" },
  { id: "3", name: "Carol Wu", firm: "Andreessen", email: "carol@a16z.com", stage: "Lead" },
  { id: "4", name: "Dan Kim", firm: "Benchmark", email: "dan@benchmark.com", stage: "Contacted" },
];

const SEED_INTERACTIONS: Interaction[] = [
  { id: "1", investorId: "1", type: "Meeting", notes: "Intro call went well", date: "2024-01-15" },
  { id: "2", investorId: "2", type: "Email", notes: "Sent deck", date: "2024-01-20" },
];

let investors: Investor[] = SEED_INVESTORS.map((i) => ({ ...i }));
let interactions: Interaction[] = SEED_INTERACTIONS.map((i) => ({ ...i }));
let nextInvestorId = 5;
let nextInteractionId = 3;

export function getInvestors(): Investor[] {
  return investors.map((i) => ({ ...i }));
}

export function addInvestor(data: Omit<Investor, "id">): Investor {
  const investor: Investor = { ...data, id: String(nextInvestorId++) };
  investors.push(investor);
  return { ...investor };
}

export function updateInvestor(id: string, data: Partial<Omit<Investor, "id">>): Investor | null {
  const idx = investors.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  investors[idx] = { ...investors[idx], ...data };
  return { ...investors[idx] };
}

export function deleteInvestor(id: string): boolean {
  const idx = investors.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  investors.splice(idx, 1);
  return true;
}

export function getInteractions(): Interaction[] {
  return interactions.map((i) => ({ ...i }));
}

export function addInteraction(data: Omit<Interaction, "id">): Interaction {
  const interaction: Interaction = { ...data, id: String(nextInteractionId++) };
  interactions.push(interaction);
  return { ...interaction };
}

export function __reset(): void {
  investors = SEED_INVESTORS.map((i) => ({ ...i }));
  interactions = SEED_INTERACTIONS.map((i) => ({ ...i }));
  nextInvestorId = 5;
  nextInteractionId = 3;
}
