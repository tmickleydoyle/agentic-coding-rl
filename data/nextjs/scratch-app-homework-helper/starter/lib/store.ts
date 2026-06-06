import type { Assignment, StudyNote, SubjectStats, AssignmentStatus } from "./types";

export function getAssignments(): Assignment[] { return []; }
export function getNotes(): StudyNote[] { return []; }
export function addAssignment(_data: Omit<Assignment, "id">): Assignment { throw new Error("Not implemented"); }
export function updateAssignmentStatus(_id: string, _status: AssignmentStatus): Assignment | null { return null; }
export function deleteAssignment(_id: string): boolean { return false; }
export function addNote(_data: Omit<StudyNote, "id">): StudyNote { throw new Error("Not implemented"); }
export function deleteNote(_id: string): boolean { return false; }
export function getSubjectStats(): SubjectStats[] { return []; }
export function getOverdueCount(_today: string): number { return 0; }
export function __reset(): void {}
