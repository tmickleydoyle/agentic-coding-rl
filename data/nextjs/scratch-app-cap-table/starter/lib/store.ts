import { Shareholder, Round } from "./types";

export function getShareholders(): Shareholder[] { return []; }
export function addShareholder(_data: Omit<Shareholder, "id">): Shareholder {
  return { id: "", name: "", type: "Founder", shares: 0 };
}
export function deleteShareholder(_id: string): boolean { return false; }
export function getRounds(): Round[] { return []; }
export function addRound(_data: Omit<Round, "id">): Round {
  return { id: "", name: "", date: "", sharePrice: 0, newShares: 0 };
}
export function getTotalShares(): number { return 0; }
export function getLatestSharePrice(): number | null { return null; }
export function __reset(): void {}
