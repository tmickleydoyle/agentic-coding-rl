export type EntryStatus = "Pending" | "Transferred" | "Disputed";

export interface InheritanceEntry {
  id: string;
  heir: string;
  amount: number;
  date: string;
  status: EntryStatus;
}

export interface Heir {
  id: string;
  name: string;
  share: number;
}
