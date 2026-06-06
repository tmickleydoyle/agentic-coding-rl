import type { FoodItem, Donation, Client, FoodCategory } from "./types";

const seedItems: FoodItem[] = [
  { id: "item1", name: "Canned Beans", category: "Canned", quantity: 150, unit: "cans", expiry: "2025-12-01" },
  { id: "item2", name: "Rice", category: "Dry", quantity: 80, unit: "lbs", expiry: "2026-06-01" },
  { id: "item3", name: "Apples", category: "Produce", quantity: 40, unit: "lbs", expiry: "2024-06-15" },
];

const seedDonations: Donation[] = [
  { id: "don1", donor: "Local Supermarket", items: "50 cans beans, 20 lbs rice", date: "2024-06-01", status: "Received" },
  { id: "don2", donor: "Community Drive", items: "30 lbs apples", date: "2024-06-05", status: "Pending" },
];

const seedClients: Client[] = [
  { id: "cli1", name: "Smith Family", householdSize: 4, lastVisit: "2024-05-20" },
  { id: "cli2", name: "Jones Family", householdSize: 2, lastVisit: "2024-06-01" },
  { id: "cli3", name: "Rivera Family", householdSize: 5, lastVisit: "2024-05-15" },
];

let items: FoodItem[] = seedItems.map((i) => ({ ...i }));
let donations: Donation[] = seedDonations.map((d) => ({ ...d }));
let clients: Client[] = seedClients.map((c) => ({ ...c }));
let nextItemId = 4;
let nextCliId = 4;

export function getItems(): FoodItem[] { return items; }
export function getDonations(): Donation[] { return donations; }
export function getClients(): Client[] { return clients; }

export function addItem(name: string, category: FoodCategory, quantity: number, unit: string, expiry: string): FoodItem {
  const item: FoodItem = { id: `item${nextItemId++}`, name, category, quantity, unit, expiry };
  items = [...items, item];
  return item;
}

export function adjustQuantity(id: string, delta: number): void {
  items = items.map((i) => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i);
}

export function markReceived(id: string): void {
  donations = donations.map((d) => d.id === id ? { ...d, status: "Received" } : d);
}

export function addClient(name: string, householdSize: number): Client {
  const c: Client = { id: `cli${nextCliId++}`, name, householdSize, lastVisit: "" };
  clients = [...clients, c];
  return c;
}

export function logVisit(id: string): void {
  const today = new Date().toISOString().slice(0, 10);
  clients = clients.map((c) => c.id === id ? { ...c, lastVisit: today } : c);
}

export function __reset(): void {
  items = seedItems.map((i) => ({ ...i }));
  donations = seedDonations.map((d) => ({ ...d }));
  clients = seedClients.map((c) => ({ ...c }));
  nextItemId = 4; nextCliId = 4;
}
