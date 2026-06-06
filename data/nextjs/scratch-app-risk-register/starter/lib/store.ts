import type { Risk, RiskCategory, RiskStatus } from "./types";

export function getRisks(): Risk[] {
  return [];
}

export function getRisk(_id: string): Risk | undefined {
  return undefined;
}

export function addRisk(_data: {
  title: string; category: RiskCategory; likelihood: number;
  impact: number; status: RiskStatus; owner: string; description: string;
}): Risk {
  throw new Error("Not implemented");
}

export function __reset(): void {}
