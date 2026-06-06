import { Investor, Interaction } from "./types";

export function getInvestors(): Investor[] { return []; }
export function addInvestor(_data: Omit<Investor, "id">): Investor {
  return { id: "", name: "", firm: "", email: "", stage: "Lead" };
}
export function updateInvestor(_id: string, _data: Partial<Omit<Investor, "id">>): Investor | null { return null; }
export function deleteInvestor(_id: string): boolean { return false; }
export function getInteractions(): Interaction[] { return []; }
export function addInteraction(_data: Omit<Interaction, "id">): Interaction {
  return { id: "", investorId: "", type: "Call", notes: "", date: "" };
}
export function __reset(): void {}
