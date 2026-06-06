import type { Campaign, Donor } from "./types";
export function getCampaigns(): Campaign[] { return []; }
export function getDonors(): Donor[] { return []; }
export function donate(_campaignId: string, _donorId: string, _amount: number): void {}
export function addDonor(_name: string, _email: string): Donor { return { id: "", name: "", email: "", totalDonated: 0, campaignCount: 0 }; }
export function addCampaign(_name: string, _goal: number, _endDate: string): Campaign { return { id: "", name: "", goal: 0, raised: 0, status: "Active", endDate: "" }; }
export function getLeaderboard(): Donor[] { return []; }
export function __reset(): void {}
