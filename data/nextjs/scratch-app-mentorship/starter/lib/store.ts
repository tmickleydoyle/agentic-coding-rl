import { Mentor, Session, Goal } from "./types";

export function __reset(): void {}
export function getMentors(): Mentor[] { return []; }
export function addMentor(_data: { name: string; specialty: string; email: string }): Mentor {
  return { id: "", name: "", specialty: "", email: "", active: false };
}
export function deleteMentor(_id: string): void {}
export function toggleMentorActive(_id: string): void {}
export function getSessions(): Session[] { return []; }
export function addSession(_data: { mentorId: string; date: string; duration: number; notes: string; upcoming: boolean }): Session {
  return { id: "", mentorId: "", date: "", duration: 0, notes: "", upcoming: false };
}
export function getGoals(): Goal[] { return []; }
export function toggleGoal(_id: string): void {}
export function addGoal(_data: { mentorId: string; title: string; description: string; dueDate: string }): Goal {
  return { id: "", mentorId: "", title: "", description: "", completed: false, dueDate: "" };
}
