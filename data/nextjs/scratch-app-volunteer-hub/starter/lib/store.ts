import type { Volunteer, Assignment } from "./types";

export function getVolunteers(): Volunteer[] { return []; }
export function getAssignments(): Assignment[] { return []; }
export function toggleVolunteerStatus(_id: string): void {}
export function addVolunteer(_name: string, _skills: string[], _status?: Volunteer["status"]): Volunteer {
  return { id: "", name: "", skills: [], status: "Active" };
}
export function addAssignment(_volunteerId: string, _title: string, _date: string): Assignment {
  return { id: "", volunteerId: "", title: "", date: "", status: "Pending" };
}
export function markComplete(_id: string): void {}
export function __reset(): void {}
