import type { PackingList } from "./types";

const seed: PackingList[] = [
  {
    id: "1", tripName: "Japan Trip", destination: "Tokyo", departureDate: "2024-03-15",
    items: [
      { id: "i1", name: "Passport", category: "Documents", checked: true, quantity: 1 },
      { id: "i2", name: "T-Shirts", category: "Clothing", checked: false, quantity: 5 },
      { id: "i3", name: "Charger", category: "Electronics", checked: true, quantity: 1 },
    ],
  },
  {
    id: "2", tripName: "Italy Tour", destination: "Rome", departureDate: "2024-05-02",
    items: [
      { id: "i4", name: "Sunscreen", category: "Toiletries", checked: false, quantity: 2 },
      { id: "i5", name: "Camera", category: "Electronics", checked: false, quantity: 1 },
    ],
  },
];

let lists: PackingList[] = seed.map((l) => ({ ...l, items: l.items.map((i) => ({ ...i })) }));
let nextId = 3;

export function getLists(): PackingList[] {
  return lists;
}

export function addList(data: { tripName: string; destination: string; departureDate: string }): PackingList {
  const list: PackingList = { ...data, id: String(nextId++), items: [] };
  lists.push(list);
  return list;
}

export function __reset(): void {
  lists = seed.map((l) => ({ ...l, items: l.items.map((i) => ({ ...i })) }));
  nextId = 3;
}
