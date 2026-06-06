export type ContractStatus = "Active" | "Expired" | "Pending" | "Terminated";

export interface Contract {
  id: string;
  title: string;
  party: string;
  value: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
}

export type Route =
  | { name: "dashboard" }
  | { name: "list" }
  | { name: "add" }
  | { name: "detail"; id: string };
