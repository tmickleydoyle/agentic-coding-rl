import { Milestone, Application, CareerSkill } from "./types";

const seedMilestones: Milestone[] = [
  { id: "ml1", title: "Complete AWS Certification", description: "Pass Solutions Architect exam", targetDate: "2024-06-30", completed: false, category: "education" },
  { id: "ml2", title: "Lead a Project", description: "Lead cross-functional team project", targetDate: "2024-09-01", completed: false, category: "experience" },
  { id: "ml3", title: "Build Portfolio", description: "3 public GitHub projects", targetDate: "2024-03-01", completed: true, category: "skill" },
];

const seedApplications: Application[] = [
  { id: "a1", company: "TechGiant", role: "Senior Engineer", appliedDate: "2024-02-01", status: "interview", notes: "Second round scheduled" },
  { id: "a2", company: "StartupX", role: "Staff Engineer", appliedDate: "2024-02-15", status: "applied", notes: "" },
  { id: "a3", company: "OldCorp", role: "Lead Dev", appliedDate: "2024-01-10", status: "rejected", notes: "Salary mismatch" },
];

const seedSkills: CareerSkill[] = [
  { id: "sk1", name: "Kubernetes", proficiency: "beginner", required: true },
  { id: "sk2", name: "System Design", proficiency: "intermediate", required: true },
  { id: "sk3", name: "TypeScript", proficiency: "advanced", required: false },
];

let milestones: Milestone[] = seedMilestones.map((m) => ({ ...m }));
let applications: Application[] = seedApplications.map((a) => ({ ...a }));
let skills: CareerSkill[] = seedSkills.map((s) => ({ ...s }));
let mlC = 4, appC = 4, skC = 4;

export function __reset() {
  milestones = seedMilestones.map((m) => ({ ...m }));
  applications = seedApplications.map((a) => ({ ...a }));
  skills = seedSkills.map((s) => ({ ...s }));
  mlC = 4; appC = 4; skC = 4;
}

export function getMilestones(): Milestone[] { return milestones; }
export function addMilestone(data: { title: string; description: string; targetDate: string; category: Milestone["category"] }): Milestone {
  const m: Milestone = { id: `ml${mlC++}`, ...data, completed: false };
  milestones.push(m);
  return m;
}
export function toggleMilestone(id: string): void {
  const m = milestones.find((m) => m.id === id);
  if (m) m.completed = !m.completed;
}

export function getApplications(): Application[] { return applications; }
export function addApplication(data: { company: string; role: string; notes: string }): Application {
  const a: Application = { id: `a${appC++}`, ...data, appliedDate: new Date().toISOString().slice(0, 10), status: "applied" };
  applications.push(a);
  return a;
}
export function updateApplicationStatus(id: string, status: Application["status"]): void {
  const a = applications.find((a) => a.id === id);
  if (a) a.status = status;
}

export function getSkills(): CareerSkill[] { return skills; }
export function addSkill(data: { name: string; proficiency: CareerSkill["proficiency"]; required: boolean }): CareerSkill {
  const s: CareerSkill = { id: `sk${skC++}`, ...data };
  skills.push(s);
  return s;
}
export function updateSkillProficiency(id: string, proficiency: CareerSkill["proficiency"]): void {
  const s = skills.find((s) => s.id === id);
  if (s) s.proficiency = proficiency;
}
