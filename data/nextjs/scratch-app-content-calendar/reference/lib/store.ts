import { ContentItem, ContentStatus } from "./types";

const seed: ContentItem[] = [
  { id: "c1", title: "Q1 Product Launch", body: "", channel: "blog", status: "approved", scheduledDate: "2030-03-01", createdAt: 1000 },
  { id: "c2", title: "Feature Spotlight Tweet", body: "", channel: "twitter", status: "draft", scheduledDate: "2030-03-05", createdAt: 2000 },
  { id: "c3", title: "LinkedIn Thought Leadership", body: "", channel: "linkedin", status: "review", scheduledDate: "2030-03-10", createdAt: 3000 },
  { id: "c4", title: "Monthly Newsletter", body: "", channel: "email", status: "approved", scheduledDate: "2030-03-15", createdAt: 4000 },
  { id: "c5", title: "Release Notes Post", body: "", channel: "blog", status: "published", scheduledDate: "2030-02-28", createdAt: 5000 },
];

let items: ContentItem[] = seed.map((i) => ({ ...i }));

export function __reset() { items = seed.map((i) => ({ ...i })); }

export function getItems(status?: ContentStatus): ContentItem[] {
  const list = items.map((i) => ({ ...i }));
  if (status) return list.filter((i) => i.status === status);
  return list;
}

export function addItem(data: Omit<ContentItem, "id" | "createdAt">): ContentItem | { error: string } {
  if (!data.title || !data.scheduledDate) return { error: "Title and date required" };
  const item: ContentItem = { id: `c${Date.now()}`, createdAt: Date.now(), ...data };
  items.push(item);
  return { ...item };
}

export function updateItem(id: string, data: Partial<Omit<ContentItem, "id">>): ContentItem | null {
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data };
  return { ...items[idx] };
}

export function publishItem(id: string): ContentItem | { error: string } {
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return { error: "Not found" };
  if (items[idx].status !== "approved") return { error: "Item must be approved before publishing" };
  items[idx] = { ...items[idx], status: "published" };
  return { ...items[idx] };
}

export function deleteItem(id: string): boolean {
  const before = items.length;
  items = items.filter((i) => i.id !== id);
  return items.length < before;
}
