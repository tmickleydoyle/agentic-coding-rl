import type { Contract, ContractStatus } from "./types";

const seed: Contract[] = [
  { id: "1", title: "Software License Agreement", party: "Acme Corp", value: 50000, startDate: "2024-01-01", endDate: "2024-12-31", status: "Active" },
  { id: "2", title: "Consulting Services Contract", party: "Globex Inc", value: 25000, startDate: "2024-03-01", endDate: "2024-09-30", status: "Active" },
  { id: "3", title: "Maintenance Agreement", party: "Initech LLC", value: 12000, startDate: "2023-01-01", endDate: "2023-12-31", status: "Expired" },
];

let contracts: Contract[] = seed.map((c) => ({ ...c }));
let nextId = 4;

export function getContracts(): Contract[] {
  return contracts;
}

export function getContract(id: string): Contract | undefined {
  return contracts.find((c) => c.id === id);
}

export function addContract(data: {
  title: string;
  party: string;
  value: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
}): Contract {
  const c: Contract = { id: String(nextId++), ...data };
  contracts.push(c);
  return c;
}

export function __reset(): void {
  contracts = seed.map((c) => ({ ...c }));
  nextId = 4;
}
