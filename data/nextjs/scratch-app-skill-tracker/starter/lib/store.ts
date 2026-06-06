import { Skill, ProgressEntry, Resource } from "./types";

export function __reset(): void {}
export function getSkills(): Skill[] { return []; }
export function addSkill(_data: { name: string; category: string; level: Skill["level"] }): Skill {
  return { id: "", name: "", category: "", level: "beginner", hoursTotal: 0 };
}
export function updateSkillLevel(_id: string, _level: Skill["level"]): void {}
export function getEntries(): ProgressEntry[] { return []; }
export function addEntry(_data: { skillId: string; date: string; hoursLogged: number; notes: string }): ProgressEntry {
  return { id: "", skillId: "", date: "", hoursLogged: 0, notes: "" };
}
export function getResources(): Resource[] { return []; }
export function addResource(_data: { skillId: string; title: string; url: string; type: Resource["type"] }): Resource {
  return { id: "", skillId: "", title: "", url: "", type: "article", completed: false };
}
export function toggleResource(_id: string): void {}
