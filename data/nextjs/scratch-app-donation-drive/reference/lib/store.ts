import type { Campaign, Donor, CampaignStatus } from "./types";

const seedCampaigns: Campaign[] = [
  { id: "c1", name: "Winter Shelter Fund", goal: 5000, raised: 3200, status: "Active", endDate: "2024-12-31" },
  { id: "c2", name: "School Supplies Drive", goal: 1000, raised: 1000, status: "Closed", endDate: "2024-08-01" },
  { id: "c3", name: "Food Pantry Restock", goal: 2000, raised: 750, status: "Active", endDate: "2024-11-30" },
];

const seedDonors: Donor[] = [
  { id: "d1", name: "Alice Wong", email: "alice@example.com", totalDonated: 500, campaignCount: 2 },
  { id: "d2", name: "Bob Garcia", email: "bob@example.com", totalDonated: 300, campaignCount: 1 },
  { id: "d3", name: "Carol Smith", email: "carol@example.com", totalDonated: 750, campaignCount: 3 },
];

let campaigns: Campaign[] = seedCampaigns.map((c) => ({ ...c }));
let donors: Donor[] = seedDonors.map((d) => ({ ...d }));
let nextCId = 4;
let nextDId = 4;

export function getCampaigns(): Campaign[] { return campaigns; }
export function getDonors(): Donor[] { return donors; }

export function donate(campaignId: string, donorId: string, amount: number): void {
  if (amount <= 0) return;
  campaigns = campaigns.map((c) => c.id === campaignId && c.status === "Active" ? { ...c, raised: c.raised + amount } : c);
  donors = donors.map((d) => d.id === donorId ? { ...d, totalDonated: d.totalDonated + amount } : d);
}

export function addDonor(name: string, email: string): Donor {
  const d: Donor = { id: `d${nextDId++}`, name, email, totalDonated: 0, campaignCount: 0 };
  donors = [...donors, d];
  return d;
}

export function addCampaign(name: string, goal: number, endDate: string): Campaign {
  const c: Campaign = { id: `c${nextCId++}`, name, goal, raised: 0, status: "Active", endDate };
  campaigns = [...campaigns, c];
  return c;
}

export function getLeaderboard(): Donor[] {
  return [...donors].sort((a, b) => b.totalDonated - a.totalDonated);
}

export function __reset(): void {
  campaigns = seedCampaigns.map((c) => ({ ...c }));
  donors = seedDonors.map((d) => ({ ...d }));
  nextCId = 4; nextDId = 4;
}
