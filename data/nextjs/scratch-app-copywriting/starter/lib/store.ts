import { CopyProject, Brief, Copy, CopyStatus } from "./types";

export function __reset() {}
export function getProjects(): CopyProject[] { return []; }
export function addProject(_data: Omit<CopyProject, "id" | "createdAt">): CopyProject | { error: string } { return { error: "not implemented" }; }
export function archiveProject(_id: string): boolean { return false; }
export function getBriefs(_projectId?: string): Brief[] { return []; }
export function addBrief(_data: Omit<Brief, "id" | "createdAt">): Brief | { error: string } { return { error: "not implemented" }; }
export function getCopies(_status?: CopyStatus): Copy[] { return []; }
export function addCopy(_data: Omit<Copy, "id" | "createdAt">): Copy | { error: string } { return { error: "not implemented" }; }
export function updateCopyStatus(_id: string, _status: CopyStatus): Copy | null { return null; }
export function rateCopy(_id: string, _rating: number): Copy | { error: string } { return { error: "not implemented" }; }
