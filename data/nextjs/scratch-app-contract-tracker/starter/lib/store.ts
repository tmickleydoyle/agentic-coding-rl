import type { Contract, ContractStatus } from "./types";

export function getContracts(): Contract[] {
  return [];
}

export function getContract(_id: string): Contract | undefined {
  return undefined;
}

export function addContract(_data: {
  title: string; party: string; value: number;
  startDate: string; endDate: string; status: ContractStatus;
}): Contract {
  throw new Error("Not implemented");
}

export function __reset(): void {}
