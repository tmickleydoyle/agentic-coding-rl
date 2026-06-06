import { Skill, ProgressEntry, Resource } from "./types";

const seedSkills: Skill[] = [
  { id: "sk1", name: "React", category: "Frontend", level: "advanced", hoursTotal: 120 },
  { id: "sk2", name: "Go", category: "Backend", level: "intermediate", hoursTotal: 45 },
  { id: "sk3", name: "Docker", category: "DevOps", level: "beginner", hoursTotal: 10 },
];

const seedEntries: ProgressEntry[] = [
  { id: "p1", skillId: "sk1", date: "2024-03-11", hoursLogged: 2, notes: "Hooks review" },
  { id: "p2", skillId: "sk2", date: "2024-03-12", hoursLogged: 3, notes: "Goroutines" },
  { id: "p3", skillId: "sk1", date: "2024-03-10", hoursLogged: 1, notes: "Context API" },
];

const seedResources: Resource[] = [
  { id: "r1", skillId: "sk1", title: "React Docs", url: "https://react.dev", type: "article", completed: true },
  { id: "r2", skillId: "sk2", title: "Go Tour", url: "https://tour.golang.org", type: "course", completed: false },
  { id: "r3", skillId: "sk3", title: "Docker Tutorial", url: "https://docs.docker.com", type: "article", completed: false },
];

let skills: Skill[] = seedSkills.map((s) => ({ ...s }));
let entries: ProgressEntry[] = seedEntries.map((e) => ({ ...e }));
let resources: Resource[] = seedResources.map((r) => ({ ...r }));
let skC = 4, pC = 4, rC = 4;

export function __reset() {
  skills = seedSkills.map((s) => ({ ...s }));
  entries = seedEntries.map((e) => ({ ...e }));
  resources = seedResources.map((r) => ({ ...r }));
  skC = 4; pC = 4; rC = 4;
}

export function getSkills(): Skill[] { return skills; }
export function addSkill(data: { name: string; category: string; level: Skill["level"] }): Skill {
  const s: Skill = { id: `sk${skC++}`, ...data, hoursTotal: 0 };
  skills.push(s);
  return s;
}
export function updateSkillLevel(id: string, level: Skill["level"]): void {
  const s = skills.find((s) => s.id === id);
  if (s) s.level = level;
}

export function getEntries(): ProgressEntry[] { return entries; }
export function addEntry(data: { skillId: string; date: string; hoursLogged: number; notes: string }): ProgressEntry {
  const e: ProgressEntry = { id: `p${pC++}`, ...data };
  entries.push(e);
  const s = skills.find((s) => s.id === data.skillId);
  if (s) s.hoursTotal += data.hoursLogged;
  return e;
}

export function getResources(): Resource[] { return resources; }
export function addResource(data: { skillId: string; title: string; url: string; type: Resource["type"] }): Resource {
  const r: Resource = { id: `r${rC++}`, ...data, completed: false };
  resources.push(r);
  return r;
}
export function toggleResource(id: string): void {
  const r = resources.find((r) => r.id === id);
  if (r) r.completed = !r.completed;
}
