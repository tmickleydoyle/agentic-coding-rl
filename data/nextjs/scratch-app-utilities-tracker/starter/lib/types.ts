export type UtilityType = "electricity" | "water" | "gas" | "internet" | "other";

export interface Utility {
  id: string;
  name: string;
  type: UtilityType;
  provider: string;
  accountNumber: string;
}

export interface Bill {
  id: string;
  utilityId: string;
  month: string;
  amount: number;
  dueDate: string;
  paid: boolean;
}

export interface Reading {
  id: string;
  utilityId: string;
  month: string;
  units: number;
  reading: number;
}
