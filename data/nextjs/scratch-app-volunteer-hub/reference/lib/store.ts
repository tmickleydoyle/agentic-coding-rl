import type { Volunteer, Assignment } from "./types";

const seedVolunteers: Volunteer[] = [
  { id: "v1", name: "Alice Chen", skills: ["tutoring", "driving"], status: "Active" },
  { id: "v2", name: "Bob Martinez", skills: ["cooking", "first-aid"], status: "Active" },
  { id: "v3", name: "Carol Smith", skills: ["driving", "logistics"], status: "Inactive" },
];

const seedAssignments: Assignment[] = [
  { id: "a1", volunteerId: "v1", title: "Tutor Session", date: "2024-06-01", status: "Completed" },
  { id: "a2", volunteerId: "v2", title: "Meal Prep", date: "2024-06-05", status: "Pending" },
  { id: "a3", volunteerId: "v1", title: "Library Reading", date: "2024-06-10", status: "Pending" },
];

let volunteers: Volunteer[] = seedVolunteers.map((v) => ({ ...v }));
let assignments: Assignment[] = seedAssignments.map((a) => ({ ...a }));
let nextVId = 4;
let nextAId = 4;

export function getVolunteers(): Volunteer[] {
  return volunteers;
}

export function getAssignments(): Assignment[] {
  return assignments;
}

export function toggleVolunteerStatus(id: string): void {
  volunteers = volunteers.map((v) =>
    v.id === id ? { ...v, status: v.status === "Active" ? "Inactive" : "Active" } : v
  );
}

export function addVolunteer(name: string, skills: string[], status: Volunteer["status"] = "Active"): Volunteer {
  const v: Volunteer = { id: `v${nextVId++}`, name, skills, status };
  volunteers = [...volunteers, v];
  return v;
}

export function addAssignment(volunteerId: string, title: string, date: string): Assignment {
  const a: Assignment = { id: `a${nextAId++}`, volunteerId, title, date, status: "Pending" };
  assignments = [...assignments, a];
  return a;
}

export function markComplete(id: string): void {
  assignments = assignments.map((a) =>
    a.id === id ? { ...a, status: "Completed" } : a
  );
}

export function __reset(): void {
  volunteers = seedVolunteers.map((v) => ({ ...v }));
  assignments = seedAssignments.map((a) => ({ ...a }));
  nextVId = 4;
  nextAId = 4;
}
