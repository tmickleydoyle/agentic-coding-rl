import type { SignOffItem, SignOffStatus } from "./types";

function computeStatus(signers: string[], signed: string[]): SignOffStatus {
  if (signed.length === 0) return "Pending";
  if (signed.length >= signers.length) return "Complete";
  return "In Progress";
}

const seed: SignOffItem[] = [
  { id: "1", title: "Q1 Financial Report", signers: ["CFO", "CEO", "Auditor"], signed: ["CFO"], dueDate: "2024-03-31", status: "In Progress" },
  { id: "2", title: "Product Launch Plan", signers: ["VP Product", "VP Engineering", "CEO"], signed: ["VP Product", "VP Engineering", "CEO"], dueDate: "2024-04-15", status: "Complete" },
  { id: "3", title: "Security Audit Report", signers: ["CISO", "CTO"], signed: [], dueDate: "2024-05-01", status: "Pending" },
];

let items: SignOffItem[] = seed.map((i) => ({ ...i, signers: [...i.signers], signed: [...i.signed] }));
let nextId = 4;

export function getItems(): SignOffItem[] {
  return items;
}

export function getItem(id: string): SignOffItem | undefined {
  return items.find((i) => i.id === id);
}

export function addItem(data: { title: string; signers: string[]; dueDate: string }): SignOffItem {
  const item: SignOffItem = {
    id: String(nextId++),
    title: data.title,
    signers: data.signers,
    signed: [],
    dueDate: data.dueDate,
    status: "Pending",
  };
  items.push(item);
  return item;
}

export function signItem(id: string, signer: string): SignOffItem | undefined {
  const item = items.find((i) => i.id === id);
  if (!item) return undefined;
  if (!item.signed.includes(signer)) {
    item.signed.push(signer);
    item.status = computeStatus(item.signers, item.signed);
  }
  return item;
}

export function __reset(): void {
  items = seed.map((i) => ({ ...i, signers: [...i.signers], signed: [...i.signed] }));
  nextId = 4;
}
