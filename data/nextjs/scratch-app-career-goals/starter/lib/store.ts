import { Milestone, Application, CareerSkill } from "./types";

export function __reset(): void {}
export function getMilestones(): Milestone[] { return []; }
export function addMilestone(_data: { title: string; description: string; targetDate: string; category: Milestone["category"] }): Milestone {
  return { id: "", title: "", description: "", targetDate: "", completed: false, category: "skill" };
}
export function toggleMilestone(_id: string): void {}
export function getApplications(): Application[] { return []; }
export function addApplication(_data: { company: string; role: string; notes: string }): Application {
  return { id: "", company: "", role: "", appliedDate: "", status: "applied", notes: "" };
}
export function updateApplicationStatus(_id: string, _status: Application["status"]): void {}
export function getSkills(): CareerSkill[] { return []; }
export function addSkill(_data: { name: string; proficiency: CareerSkill["proficiency"]; required: boolean }): CareerSkill {
  return { id: "", name: "", proficiency: "beginner", required: false };
}
export function updateSkillProficiency(_id: string, _proficiency: CareerSkill["proficiency"]): void {}
