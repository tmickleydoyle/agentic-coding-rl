import { CopyProject, Brief, Copy, CopyStatus } from "./types";

const seedProjects: CopyProject[] = [
  { id: "pr1", name: "Nike Campaign", client: "SportsCo", status: "active", deadline: "2030-06-30", createdAt: 1000 },
  { id: "pr2", name: "SaaS Onboarding", client: "TechCorp", status: "active", deadline: "2030-07-15", createdAt: 2000 },
  { id: "pr3", name: "Holiday Promo", client: "RetailCo", status: "completed", deadline: "2029-12-25", createdAt: 3000 },
];
const seedBriefs: Brief[] = [
  { id: "b1", projectId: "pr1", audience: "athletes 18-35", tone: "motivational", goal: "brand awareness", keyMessages: "performance, drive", createdAt: 1000 },
  { id: "b2", projectId: "pr2", audience: "B2B decision makers", tone: "professional", goal: "trial signups", keyMessages: "ROI, simplicity", createdAt: 2000 },
];
const seedCopies: Copy[] = [
  { id: "cp1", briefId: "b1", headline: "Just Do It Again", body: "Push beyond limits.", cta: "Shop Now", status: "draft", rating: 0, createdAt: 1000 },
  { id: "cp2", briefId: "b2", headline: "Start Free Today", body: "No credit card needed.", cta: "Start Free", status: "review", rating: 4, createdAt: 2000 },
  { id: "cp3", briefId: "b1", headline: "Win This Season", body: "Gear up for victory.", cta: "Buy Now", status: "review", rating: 3, createdAt: 3000 },
];

let projects: CopyProject[] = seedProjects.map((p) => ({ ...p }));
let briefs: Brief[] = seedBriefs.map((b) => ({ ...b }));
let copies: Copy[] = seedCopies.map((c) => ({ ...c }));

export function __reset() {
  projects = seedProjects.map((p) => ({ ...p }));
  briefs = seedBriefs.map((b) => ({ ...b }));
  copies = seedCopies.map((c) => ({ ...c }));
}

export function getProjects(): CopyProject[] { return projects.map((p) => ({ ...p })); }
export function addProject(data: Omit<CopyProject, "id" | "createdAt">): CopyProject | { error: string } {
  if (!data.name.trim() || !data.client.trim()) return { error: "Name and client required" };
  const p: CopyProject = { id: `pr${Date.now()}`, createdAt: Date.now(), ...data };
  projects.push(p);
  return { ...p };
}
export function archiveProject(id: string): boolean {
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  projects[idx] = { ...projects[idx], status: "archived" };
  return true;
}

export function getBriefs(projectId?: string): Brief[] {
  const list = briefs.map((b) => ({ ...b }));
  if (projectId) return list.filter((b) => b.projectId === projectId);
  return list;
}
export function addBrief(data: Omit<Brief, "id" | "createdAt">): Brief | { error: string } {
  if (!data.projectId) return { error: "projectId required" };
  if (briefs.some((b) => b.projectId === data.projectId)) return { error: "Project already has a brief" };
  const b: Brief = { id: `b${Date.now()}`, createdAt: Date.now(), ...data };
  briefs.push(b);
  return { ...b };
}

export function getCopies(status?: CopyStatus): Copy[] {
  const list = copies.map((c) => ({ ...c }));
  if (status) return list.filter((c) => c.status === status);
  return list;
}
export function addCopy(data: Omit<Copy, "id" | "createdAt">): Copy | { error: string } {
  if (!data.briefId || !data.headline.trim() || !data.body.trim()) return { error: "briefId, headline, and body required" };
  if (data.rating < 0 || data.rating > 5) return { error: "Rating must be 0-5" };
  const c: Copy = { id: `cp${Date.now()}`, createdAt: Date.now(), ...data };
  copies.push(c);
  return { ...c };
}
export function updateCopyStatus(id: string, status: CopyStatus): Copy | null {
  const idx = copies.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  copies[idx] = { ...copies[idx], status };
  return { ...copies[idx] };
}
export function rateCopy(id: string, rating: number): Copy | { error: string } {
  if (rating < 0 || rating > 5) return { error: "Rating must be 0-5" };
  const idx = copies.findIndex((c) => c.id === id);
  if (idx === -1) return { error: "Not found" };
  copies[idx] = { ...copies[idx], rating };
  return { ...copies[idx] };
}
