import { Mentor, Session, Goal } from "./types";

const seedMentors: Mentor[] = [
  { id: "m1", name: "Dr. Reed", specialty: "Engineering", email: "reed@uni.edu", active: true },
  { id: "m2", name: "Ms. Patel", specialty: "Design", email: "patel@studio.com", active: true },
  { id: "m3", name: "Prof. Kim", specialty: "Engineering", email: "kim@lab.org", active: false },
];

const seedSessions: Session[] = [
  { id: "s1", mentorId: "m1", date: "2024-03-10", duration: 60, notes: "Reviewed system design", upcoming: false },
  { id: "s2", mentorId: "m1", date: "2024-04-01", duration: 45, notes: "Career planning session", upcoming: true },
  { id: "s3", mentorId: "m2", date: "2024-03-20", duration: 30, notes: "Portfolio review", upcoming: false },
];

const seedGoals: Goal[] = [
  { id: "g1", mentorId: "m1", title: "Learn Kubernetes", description: "Complete K8s course", completed: false, dueDate: "2024-06-01" },
  { id: "g2", mentorId: "m2", title: "Redesign Portfolio", description: "Update case studies", completed: true, dueDate: "2024-04-01" },
  { id: "g3", mentorId: "m1", title: "Write Blog Post", description: "Technical writing practice", completed: false, dueDate: "2024-05-15" },
];

let mentors: Mentor[] = [...seedMentors];
let sessions: Session[] = [...seedSessions];
let goals: Goal[] = [...seedGoals];
let mCounter = 4;
let sCounter = 4;
let gCounter = 4;

export function __reset() {
  mentors = [...seedMentors];
  sessions = [...seedSessions];
  goals = [...seedGoals];
  mCounter = 4;
  sCounter = 4;
  gCounter = 4;
}

export function getMentors(): Mentor[] { return mentors; }

export function addMentor(data: { name: string; specialty: string; email: string }): Mentor {
  const m: Mentor = { id: `m${mCounter++}`, ...data, active: true };
  mentors.push(m);
  return m;
}

export function deleteMentor(id: string): void {
  mentors = mentors.filter((m) => m.id !== id);
  sessions = sessions.filter((s) => s.mentorId !== id);
  goals = goals.filter((g) => g.mentorId !== id);
}

export function toggleMentorActive(id: string): void {
  const m = mentors.find((m) => m.id === id);
  if (m) m.active = !m.active;
}

export function getSessions(): Session[] { return sessions; }

export function addSession(data: { mentorId: string; date: string; duration: number; notes: string; upcoming: boolean }): Session {
  const s: Session = { id: `s${sCounter++}`, ...data };
  sessions.push(s);
  return s;
}

export function getGoals(): Goal[] { return goals; }

export function toggleGoal(id: string): void {
  const g = goals.find((g) => g.id === id);
  if (g) g.completed = !g.completed;
}

export function addGoal(data: { mentorId: string; title: string; description: string; dueDate: string }): Goal {
  const g: Goal = { id: `g${gCounter++}`, ...data, completed: false };
  goals.push(g);
  return g;
}
