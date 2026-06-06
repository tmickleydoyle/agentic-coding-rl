import { Asset, Liability, Snapshot } from "./types";

let assets: Asset[] = [
  { id: "a1", name: "Checking Account", value: 5000, category: "cash" },
  { id: "a2", name: "Home", value: 350000, category: "real_estate" },
  { id: "a3", name: "401k", value: 85000, category: "retirement" },
];

let liabilities: Liability[] = [
  { id: "l1", name: "Mortgage", amount: 280000, category: "mortgage" },
  { id: "l2", name: "Car Loan", amount: 12000, category: "loan" },
];

let snapshots: Snapshot[] = [
  { id: "s1", date: "2024-01-01", netWorth: 147000 },
];

export function getAssets(): Asset[] { return assets; }
export function getLiabilities(): Liability[] { return liabilities; }
export function getSnapshots(): Snapshot[] { return snapshots; }
export function addAsset(a: Asset): void { assets.push(a); }
export function deleteAsset(id: string): void { assets = assets.filter((a) => a.id !== id); }
export function addLiability(l: Liability): void { liabilities.push(l); }
export function deleteLiability(id: string): void { liabilities = liabilities.filter((l) => l.id !== id); }
export function addSnapshot(s: Snapshot): void { snapshots.push(s); }

export function __reset(): void {
  assets = [
    { id: "a1", name: "Checking Account", value: 5000, category: "cash" },
    { id: "a2", name: "Home", value: 350000, category: "real_estate" },
    { id: "a3", name: "401k", value: 85000, category: "retirement" },
  ];
  liabilities = [
    { id: "l1", name: "Mortgage", amount: 280000, category: "mortgage" },
    { id: "l2", name: "Car Loan", amount: 12000, category: "loan" },
  ];
  snapshots = [{ id: "s1", date: "2024-01-01", netWorth: 147000 }];
}
