import { Campaign, Subscriber, Template } from "./types";

const seedTemplates: Template[] = [
  { id: "t1", name: "Welcome Email", subject: "Welcome!", body: "Hello {name}", createdAt: 1000 },
  { id: "t2", name: "Monthly Update", subject: "This Month in Tech", body: "Hi there", createdAt: 2000 },
];
const seedSubscribers: Subscriber[] = [
  { id: "s1", email: "alice@example.com", name: "Alice", tags: ["vip"], active: true, createdAt: 1000 },
  { id: "s2", email: "bob@example.com", name: "Bob", tags: [], active: true, createdAt: 2000 },
  { id: "s3", email: "carol@example.com", name: "Carol", tags: ["vip", "developer"], active: true, createdAt: 3000 },
];
const seedCampaigns: Campaign[] = [
  { id: "c1", subject: "April Newsletter", templateId: "t2", status: "sent", scheduledAt: "2030-04-01", sentCount: 3, openCount: 2, clickCount: 1, createdAt: 1000 },
  { id: "c2", subject: "May Update", templateId: "t2", status: "draft", scheduledAt: "", sentCount: 0, openCount: 0, clickCount: 0, createdAt: 2000 },
];

let templates: Template[] = seedTemplates.map((t) => ({ ...t }));
let subscribers: Subscriber[] = seedSubscribers.map((s) => ({ ...s, tags: [...s.tags] }));
let campaigns: Campaign[] = seedCampaigns.map((c) => ({ ...c }));

export function __reset() {
  templates = seedTemplates.map((t) => ({ ...t }));
  subscribers = seedSubscribers.map((s) => ({ ...s, tags: [...s.tags] }));
  campaigns = seedCampaigns.map((c) => ({ ...c }));
}

export function getCampaigns(): Campaign[] { return campaigns.map((c) => ({ ...c })); }
export function addCampaign(data: Omit<Campaign, "id" | "createdAt">): Campaign | { error: string } {
  if (!data.subject.trim()) return { error: "Subject required" };
  const c: Campaign = { id: `c${Date.now()}`, createdAt: Date.now(), ...data };
  campaigns.push(c);
  return { ...c };
}
export function deleteCampaign(id: string): { error?: string } {
  const c = campaigns.find((x) => x.id === id);
  if (!c) return { error: "Not found" };
  if (c.status !== "draft") return { error: "Only draft campaigns can be deleted" };
  campaigns = campaigns.filter((x) => x.id !== id);
  return {};
}

export function getSubscribers(): Subscriber[] { return subscribers.map((s) => ({ ...s, tags: [...s.tags] })); }
export function addSubscriber(data: Omit<Subscriber, "id" | "createdAt">): Subscriber | { error: string } {
  if (!data.email.includes("@")) return { error: "Invalid email" };
  if (subscribers.some((s) => s.email === data.email)) return { error: "Duplicate email" };
  const s: Subscriber = { id: `s${Date.now()}`, createdAt: Date.now(), ...data, tags: [...(data.tags || [])] };
  subscribers.push(s);
  return { ...s, tags: [...s.tags] };
}
export function deactivateSubscriber(id: string): boolean {
  const idx = subscribers.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  subscribers[idx] = { ...subscribers[idx], active: false };
  return true;
}

export function getTemplates(): Template[] { return templates.map((t) => ({ ...t })); }
export function addTemplate(data: Omit<Template, "id" | "createdAt">): Template {
  const t: Template = { id: `t${Date.now()}`, createdAt: Date.now(), ...data };
  templates.push(t);
  return { ...t };
}
export function deleteTemplate(id: string): { error?: string } {
  const inUse = campaigns.some((c) => c.templateId === id && (c.status === "scheduled" || c.status === "sent"));
  if (inUse) return { error: "Template in use by scheduled/sent campaign" };
  templates = templates.filter((t) => t.id !== id);
  return {};
}
